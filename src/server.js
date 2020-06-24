const express = require("express");
const bodyParser = require("body-parser");
const Candidate = require("./models/Candidate");
const Campaign = require("./models/Campaign");
const { cpf: cpfValidator } = require("cpf-cnpj-validator");
const emailValidator = require("email-validator");
const isValidPhone = require("@brazilian-utils/is-valid-phone");

const server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.get("/candidates", async (req, res) => {
	res.send(await Candidate.find());
});

server.post("/candidates", async (req, res) => {
	const { cpf, email, phone, campaignIds } = req.body;

	try {
		// Validation
		// if (!cpfValidator.isValid(cpf)) return res.status(400).send("CPF inválido.");
		if (!emailValidator.validate(email)) return res.status(400).send("Email inválido");
		if (!isValidPhone(phone)) return res.status(400).send("Telefone inválido");
		if (!campaignIds || campaignIds.length === 0) return res.status(400).send("Ações Inválidas");

		for (const campaignId of campaignIds) {
			const campaign = await Campaign.findById(campaignId);
			const campaignCandidates = await Candidate.find({ campaignIds: campaignId });
			if (campaignCandidates.length >= campaign.openings) {
				throw `A ação ${campaign.name} está cheia.`;
			}
		}

		const createdCandidate = await Candidate.create({ ...req.body });

		return res.send(createdCandidate);
	} catch (e) {
		return res.status(400).send({ error: e });
	}
});

server.get("/campaigns", async (req, res) => {
	res.send(await Campaign.find());
});

server.get("/campaigns/available", async (req, res) => {
	const allCampaigns = await Campaign.find();

	const allCandidatesByCampaign = await Promise.all(allCampaigns.map(c => c.getCandidates()));

	const availables = [];
	for (let i = 0; i < allCampaigns.length; i++) {
		const campaign = allCampaigns[i];
		const candidates = allCandidatesByCampaign[i];

		if (candidates.length < campaign.openings) availables.push(campaign);
	}

	res.send(availables);
});

server.post("/campaigns", async (req, res) => {
	try {
		const data = req.body;

		// Validation
		if (!emailValidator.validate(data.email)) return res.status(400).send("Email Inválido");

		const campaign = await Campaign.create(data);

		res.send(campaign);
	} catch (e) {
		return res.status(400).send({ error: e });
	}
});

server.listen(3001);
