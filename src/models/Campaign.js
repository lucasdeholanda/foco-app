const mongoose = require("../database");
const Candidate = require("./Candidate");

const CampaignSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	openings: {
		type: Number,
		required: true,
		validate: {
			validator: Number.isInteger,
			message: '{VALUE} não é um número válido.'
		}
	},
	submissionDocument: {
		type: String,
		required: true
	}
});

CampaignSchema.methods.getCandidates = async function() {
	return await Candidate.find({ campaignIds: this._id });
};

const Campaign = mongoose.model("Campaign", CampaignSchema);

module.exports = Campaign;
