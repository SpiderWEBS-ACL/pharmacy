const Settings = require("../Models/Settings");
const Patient = require("../Models/Patient");

const createConfig = async (req, res) => {
    try {
      const settings = new Settings();
      await settings.save();
  
      return res.status(201).json(settings);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  const viewPatientConfig = async (req, res) => {
    try {
      const patientId = req.user.id;
      const patient = await Patient.findById(patientId)
      const settingsId = patient.Settings;
      
  
      const settings = await Settings.findById(settingsId);
      if (!settings) {
        return res.status(404).json({ error: "Settings not found" });
      }
  
      return res.status(200).json(settings);
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
      const settingsId = patient.Settings;
      const settings = await Settings.findById(settingsId);
      if (!settings) {
        return res.status(404).json({ error: "Settings not found" });
      }
      const { shippingAddress } = req.body;
      settings.shippingAddresses.push({ shippingAddress });
      await settings.save();
  
      return res.status(201).json(settings);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };


  module.exports = {
    createConfig,
  viewPatientConfig,
  addShippingAddress   
  }