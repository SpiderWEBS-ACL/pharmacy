const Config = require("../Models/Config");
const Patient = require("../Models/Patient");

const createConfig = async (req, res) => {
    try {
      const config = new Config();
      await config.save();
  
      return res.status(201).json(config);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  const viewPatientConfig = async (req, res) => {
    try {
      const patientId = req.user.id;
      const patient = await Patient.findById(patientId)
      const configId = patient.Config;
      
  
      const config = await Config.findById(configId);
      if (!config) {
        return res.status(404).json({ error: "Configuration not found" });
      }
  
      return res.status(200).json(config);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  const addShippingAddress = async (req, res) => {
    try {
      const patientId = req.user.id; 
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      const configId = patient.Config;
      const config = await Config.findById(configId);
      if (!config) {
        return res.status(404).json({ error: "Configuration not found" });
      }
      const { shippingAddress } = req.body;
      config.shippingAddresses.push({ shippingAddress });
      await config.save();
  
      return res.status(201).json(config);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };


  module.exports = {
    createConfig,
  viewPatientConfig,
  addShippingAddress   
  }