import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const LoanTrackerModule = buildModule("LoanTrackerModule", (m) => {
    const loanTracker = m.contract("LoanTracker");

    return { loanTracker };
});

export default LoanTrackerModule;

