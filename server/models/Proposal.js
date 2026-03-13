const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
    rfpId: { type: mongoose.Schema.Types.ObjectId, ref: 'RFP', required: true },
    brokerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // A. Project Identification Details
    techParkName: { type: String },
    buildingName: { type: String, required: true },
    address: { type: String, required: true },
    locationMapLink: { type: String },
    yearOfConstruction: { type: String },
    buildingGrade: { type: String, enum: ['Grade A', 'Grade A+', 'Grade B+'] },
    buildingType: { type: String, enum: ['Tech Park', 'Standalone Building'] },

    // B. Building Specifications
    totalBuildingAreaSFT: { type: Number },
    buildingConfiguration: { type: String }, // B+G+Floors
    avgFloorPlateSize: { type: Number },
    proposedFloor: { type: String },
    floorToCeilingHeight: { type: String },
    floorToFloorHeight: { type: String },
    passengerLifts: { type: Number },
    serviceLifts: { type: Number },
    emergencyExits: { type: Number },

    // Infrastructure Details
    fireComplianceStatus: { type: String },
    powerAvailabilityKVA: { type: Number },
    hvacType: { type: String, enum: ['Centralized', 'VRV', 'Chiller'] },
    dgBackupAvailability: { type: String },

    // C. Space Offering Details
    availableAreaSFT: { type: Number },
    minDivisibleArea: { type: Number },
    carpetAreaEfficiency: { type: Number },
    solutionTypeOffered: { type: [String], enum: ['Conventional', 'Managed', 'Fully Furnished'] },
    spaceCondition: { type: String, enum: ['Warm Shell', 'Bare Shell', 'Fully Furnished'] },
    expansionScope: { type: String },

    // D. Parking & Access
    carParkingRatio: { type: String },
    totalCarParksAvailable: { type: Number },
    twoWheelerParking: { type: Number },
    visitorParking: { type: Number },
    drivewayAccess: { type: String, enum: ['Single Entry', 'Dual Entry'] },
    truckLoadingBay: { type: Boolean },

    // E. Commercial Details
    rentalPrice: { type: String }, // ₹ per SFT or per seat
    camCharges: { type: String },
    securityDepositTerms: { type: String },
    lockInPeriod: { type: String },
    leaseTenure: { type: String },
    rentEscalation: { type: String },

    // F. Building Media Upload (URLs)
    media: {
        facadePhoto: { type: String },
        receptionPhoto: { type: String },
        parkingPhoto: { type: String },
        floorPhoto: { type: String },
        floorPlanPdf: { type: String },
        locationMapImage: { type: String }
    },

    // G. Occupancy & Ecosystem
    currentTenants: [String],
    vacancyPercentage: { type: Number },
    itSezStatus: { type: String },
    amenities: [String], // Cafeteria, Gym, ATM, etc.

    // System Fields
    status: {
        type: String,
        enum: ['Proposed', 'Evaluating', 'Handshake', 'Rejected'],
        default: 'Proposed'
    },
    rejectionReason: { type: String }

}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);
