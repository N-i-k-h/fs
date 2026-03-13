const mongoose = require('mongoose');

const rfpSchema = new mongoose.Schema({
    // A. Company Details
    clientName: { type: String, required: true },
    companyName: { type: String, required: true },
    yearOfRegistration: { type: String },
    companyDescription: { type: String },
    fundingStatus: {
        type: String,
        enum: ['Bootstrapped', 'Seed', 'Series A', 'Series B', 'Profitable', 'Public Listed', 'Other']
    },

    // B. Contact Details
    decisionMakerName: { type: String, required: true },
    decisionMakerEmail: { type: String, required: true },
    adminSpocEmail: { type: String },
    phone: { type: String },

    // C. Space Requirement Details
    solutionType: {
        type: [String],
        enum: ['Conventional Lease', 'Managed Office', 'Fully Furnished']
    },
    preferredLocation: { type: String },
    locationMapLink: { type: String },
    buildingTypePreference: {
        type: [String],
        enum: ['Tech Park', 'Standalone Building']
    },
    maxRadiusKM: { type: Number },

    // D. Team & Growth Details
    currentEmployees: { type: Number },
    expectedGrowth12Months: { type: Number },
    totalSeatsRequired: { type: Number, required: true },
    seatDensity: {
        type: String,
        enum: ['3/2', '3.5/2', '4/2', 'Other']
    },

    // E. Layout Requirements
    managerCabins: { type: Number },
    meetingRooms: {
        pax3: { type: Number, default: 0 },
        pax4: { type: Number, default: 0 },
        pax6: { type: Number, default: 0 },
        pax8: { type: Number, default: 0 },
        pax10: { type: Number, default: 0 },
        pax12: { type: Number, default: 0 }
    },
    receptionAreaRequired: { type: Boolean, default: false },
    collaborationZones: { type: Number, default: 0 },

    // F. Commercials & Budget
    budgetRange: { type: String }, // e.g., "₹90 per sqft" or "₹15000 per seat"
    budgetType: { type: String, enum: ['per seat', 'per sqft'] },
    carParkingRequired: { type: Number },
    twoWheelerParkingRequired: { type: Number },

    // G. Timeline
    loiSigningTimeline: { type: String },
    agreementExecutionTimeline: { type: String },
    expectedMoveInTimeline: { type: String },

    // H. Additional Notes
    additionalNotes: { type: String },
    specialRequirements: [String], // IT/SEZ, Green building, Cafeteria, etc.

    // System Fields
    status: {
        type: String,
        enum: ['Pending', 'Active', 'Evaluating', 'Handshake', 'Rejected', 'Closed'],
        default: 'Pending'
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who created it
    proposals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' }] // Proposals submitted for this RFP

}, { timestamps: true });

module.exports = mongoose.model('RFP', rfpSchema);
