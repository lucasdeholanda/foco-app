const mongoose = require("../database");

const CandidateSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	birth: {
		type: Date,
		required: true
	},
	cpf: {
		type: String,
		required: true,
		unique: true
	},
	phone: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	emailContact: {
		type: Boolean,
		required: true
	},
	campaignIds: {
		type: [String],
		ref: "Campaigns",
		required: true,
	}
});

const Candidate = mongoose.model("Candidate", CandidateSchema);

module.exports = Candidate;
