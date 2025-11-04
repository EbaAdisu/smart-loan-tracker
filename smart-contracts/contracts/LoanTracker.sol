// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LoanTracker
 * @dev Simple loan tracking contract (no real money transfers)
 * Tracks peer-to-peer loans on Sepolia testnet
 */
contract LoanTracker {
    // Enums
    enum LoanStatus {
        Pending,    // Loan created, not yet active
        Active,     // Loan is active
        Completed,  // Loan fully repaid
        Overdue,    // Loan past due date
        Cancelled   // Loan cancelled
    }

    // Structs
    struct Loan {
        uint256 id;
        address lender;
        address borrower;
        uint256 amount;
        string reason;
        uint256 dateCreated;
        uint256 dueDate;
        LoanStatus status;
        uint256 balanceRemaining;
    }

    struct Payment {
        uint256 amount;
        uint256 timestamp;
    }

    // State variables
    uint256 public nextLoanId;
    mapping(uint256 => Loan) public loans;
    mapping(uint256 => Payment[]) public loanPayments;
    mapping(address => uint256[]) private userLoans;

    // Events
    event LoanCreated(
        uint256 indexed loanId,
        address indexed lender,
        address indexed borrower,
        uint256 amount,
        string reason,
        uint256 dueDate
    );

    event StatusUpdated(
        uint256 indexed loanId,
        LoanStatus status
    );

    event PaymentRecorded(
        uint256 indexed loanId,
        address indexed payer,
        uint256 amount,
        uint256 balanceRemaining
    );

    // Modifiers
    modifier loanExists(uint256 _loanId) {
        require(_loanId < nextLoanId, "Loan does not exist");
        _;
    }

    modifier onlyLoanParties(uint256 _loanId) {
        Loan memory loan = loans[_loanId];
        require(
            msg.sender == loan.lender || msg.sender == loan.borrower,
            "Not authorized"
        );
        _;
    }

    /**
     * @dev Creates a new loan
     * @param _borrower Address of the borrower
     * @param _amount Loan amount in wei
     * @param _reason Reason for the loan
     * @param _dueDate Unix timestamp for due date
     * @return loanId The ID of the created loan
     */
    function createLoan(
        address _borrower,
        uint256 _amount,
        string memory _reason,
        uint256 _dueDate
    ) external returns (uint256) {
        require(_borrower != address(0), "Invalid borrower address");
        require(_borrower != msg.sender, "Cannot lend to yourself");
        require(_amount > 0, "Amount must be greater than zero");
        require(_dueDate > block.timestamp, "Due date must be in the future");
        require(bytes(_reason).length > 0, "Reason cannot be empty");

        uint256 loanId = nextLoanId;

        loans[loanId] = Loan({
            id: loanId,
            lender: msg.sender,
            borrower: _borrower,
            amount: _amount,
            reason: _reason,
            dateCreated: block.timestamp,
            dueDate: _dueDate,
            status: LoanStatus.Pending,
            balanceRemaining: _amount
        });

        userLoans[msg.sender].push(loanId);
        userLoans[_borrower].push(loanId);

        nextLoanId++;

        emit LoanCreated(loanId, msg.sender, _borrower, _amount, _reason, _dueDate);

        return loanId;
    }

    /**
     * @dev Updates the status of a loan
     * @param _loanId ID of the loan
     * @param _newStatus New status for the loan
     */
    function updateStatus(uint256 _loanId, LoanStatus _newStatus)
        external
        loanExists(_loanId)
        onlyLoanParties(_loanId)
    {
        Loan storage loan = loans[_loanId];
        require(loan.status != LoanStatus.Completed, "Cannot modify completed loan");
        
        loan.status = _newStatus;
        
        emit StatusUpdated(_loanId, _newStatus);
    }

    /**
     * @dev Records a payment for a loan
     * @param _loanId ID of the loan
     * @param _amount Payment amount
     */
    function recordPayment(uint256 _loanId, uint256 _amount)
        external
        loanExists(_loanId)
    {
        Loan storage loan = loans[_loanId];
        
        require(msg.sender == loan.borrower, "Only borrower can record payment");
        require(_amount > 0, "Payment amount must be greater than zero");
        require(loan.balanceRemaining > 0, "Loan already paid in full");
        require(_amount <= loan.balanceRemaining, "Payment exceeds remaining balance");
        require(
            loan.status == LoanStatus.Active || loan.status == LoanStatus.Overdue,
            "Loan must be active or overdue"
        );

        loan.balanceRemaining -= _amount;

        loanPayments[_loanId].push(Payment({
            amount: _amount,
            timestamp: block.timestamp
        }));

        // Auto-complete if fully paid
        if (loan.balanceRemaining == 0) {
            loan.status = LoanStatus.Completed;
            emit StatusUpdated(_loanId, LoanStatus.Completed);
        }

        emit PaymentRecorded(_loanId, msg.sender, _amount, loan.balanceRemaining);
    }

    /**
     * @dev Gets loan details by ID
     * @param _loanId ID of the loan
     * @return Loan struct
     */
    function getLoanById(uint256 _loanId)
        external
        view
        loanExists(_loanId)
        returns (Loan memory)
    {
        return loans[_loanId];
    }

    /**
     * @dev Gets all loan IDs for a user
     * @param _user Address of the user
     * @return Array of loan IDs
     */
    function getUserLoans(address _user)
        external
        view
        returns (uint256[] memory)
    {
        return userLoans[_user];
    }

    /**
     * @dev Gets payment history for a loan
     * @param _loanId ID of the loan
     * @return Array of payments
     */
    function getPaymentHistory(uint256 _loanId)
        external
        view
        loanExists(_loanId)
        returns (Payment[] memory)
    {
        return loanPayments[_loanId];
    }

    /**
     * @dev Marks a loan as overdue if past due date
     * @param _loanId ID of the loan
     */
    function markAsOverdue(uint256 _loanId)
        external
        loanExists(_loanId)
    {
        Loan storage loan = loans[_loanId];
        
        require(block.timestamp > loan.dueDate, "Loan is not yet overdue");
        require(loan.status == LoanStatus.Active, "Loan must be active");
        require(loan.balanceRemaining > 0, "Loan is fully paid");

        loan.status = LoanStatus.Overdue;
        
        emit StatusUpdated(_loanId, LoanStatus.Overdue);
    }

    /**
     * @dev Gets total number of loans created
     * @return Total loan count
     */
    function getTotalLoans() external view returns (uint256) {
        return nextLoanId;
    }
}

