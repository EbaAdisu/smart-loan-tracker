// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/LoanTracker.sol";

contract LoanTrackerTest is Test {
    LoanTracker public loanTracker;
    address public lender = address(0x1);
    address public borrower = address(0x2);

    function setUp() public {
        loanTracker = new LoanTracker();
    }

    function testDeployment() public {
        assertEq(loanTracker.nextLoanId(), 0);
    }

    function testCreateLoan() public {
        vm.prank(lender);
        
        uint256 amount = 100 ether;
        string memory reason = "Medical expenses";
        uint256 dueDate = block.timestamp + 30 days;

        loanTracker.createLoan(borrower, amount, reason, dueDate);

        (
            uint256 id,
            address _lender,
            address _borrower,
            uint256 _amount,
            string memory _reason,
            uint256 dateCreated,
            uint256 _dueDate,
            LoanTracker.LoanStatus status,
            uint256 balanceRemaining
        ) = loanTracker.loans(0);

        assertEq(id, 0);
        assertEq(_lender, lender);
        assertEq(_borrower, borrower);
        assertEq(_amount, amount);
        assertEq(_reason, reason);
        assertEq(uint256(status), uint256(LoanTracker.LoanStatus.Pending));
        assertEq(balanceRemaining, amount);
    }

    function testUpdateStatus() public {
        vm.prank(lender);
        uint256 dueDate = block.timestamp + 30 days;
        loanTracker.createLoan(borrower, 100 ether, "Test", dueDate);

        vm.prank(lender);
        loanTracker.updateStatus(0, LoanTracker.LoanStatus.Active);

        (, , , , , , , LoanTracker.LoanStatus status, ) = loanTracker.loans(0);
        assertEq(uint256(status), uint256(LoanTracker.LoanStatus.Active));
    }

    function testRecordPayment() public {
        vm.prank(lender);
        uint256 dueDate = block.timestamp + 30 days;
        loanTracker.createLoan(borrower, 100 ether, "Test", dueDate);

        vm.prank(lender);
        loanTracker.updateStatus(0, LoanTracker.LoanStatus.Active);

        vm.prank(borrower);
        loanTracker.recordPayment(0, 50 ether);

        (, , , , , , , , uint256 balanceRemaining) = loanTracker.loans(0);
        assertEq(balanceRemaining, 50 ether);
    }

    function testAutoCompleteWhenFullyPaid() public {
        vm.prank(lender);
        uint256 dueDate = block.timestamp + 30 days;
        loanTracker.createLoan(borrower, 100 ether, "Test", dueDate);

        vm.prank(lender);
        loanTracker.updateStatus(0, LoanTracker.LoanStatus.Active);

        vm.prank(borrower);
        loanTracker.recordPayment(0, 100 ether);

        (, , , , , , , LoanTracker.LoanStatus status, uint256 balanceRemaining) = loanTracker.loans(0);
        assertEq(uint256(status), uint256(LoanTracker.LoanStatus.Completed));
        assertEq(balanceRemaining, 0);
    }

    function testGetUserLoans() public {
        uint256 dueDate = block.timestamp + 30 days;
        
        vm.prank(lender);
        loanTracker.createLoan(borrower, 100 ether, "Test 1", dueDate);
        
        vm.prank(lender);
        loanTracker.createLoan(borrower, 200 ether, "Test 2", dueDate);

        uint256[] memory lenderLoans = loanTracker.getUserLoans(lender);
        uint256[] memory borrowerLoans = loanTracker.getUserLoans(borrower);

        assertEq(lenderLoans.length, 2);
        assertEq(borrowerLoans.length, 2);
    }
}

