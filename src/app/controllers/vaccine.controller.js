const VaccineService = require('../services/vaccine.service');
const StationService = require('../services/station.service');

const create = async (req, res) => {
  try {
    const { name } = req.body;
    const { stationId } = req.params;

    const vaccine = await VaccineService.create({ name, stationId });

    if (!vaccine) {
      return res
        .status(400)
        .json({ error: 'Não foi possível criar uma nova vacina' });
    }

    return res.status(201).json({ vaccine });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const addVaccines = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { stationId, vaccineId } = req.params;

    if (!quantity) {
      return res
        .status(400)
        .json({ error: 'A quantidade de vacinas é obrigatório' });
    }

    if (quantity <= 0) {
      return res
        .status(400)
        .json({ error: 'O numero de vacinas deve ser positivo' });
    }

    const station = await StationService.getById(stationId);

    if (!station) {
      return res.status(400).json({ error: 'Posto não encontrado' });
    }

    const vaccine = await VaccineService.addVaccines({
      quantity,
      stationId,
      vaccineId,
    });

    if (!vaccine) {
      return res
        .status(400)
        .json({ error: 'Não foi possível adicionar vacinas' });
    }

    await StationService.addVaccines({ quantity, stationId });

    return res.status(201).json({ vaccine });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const editVaccine = async (req, res) => {
  try {
    const { name } = req.body;
    const { stationId, vaccineId } = req.params;

    if (!name) {
      return res.status(400).json({ error: 'O nome da vacina é obrigatório' });
    }

    const station = await StationService.getById(stationId);

    if (!station) {
      return res.status(400).json({ error: 'Posto não encontrado' });
    }

    const vaccine = await VaccineService.editVaccine({
      name,
      stationId,
      vaccineId,
    });

    if (!vaccine) {
      return res
        .status(400)
        .json({ error: 'Não foi possível adicionar vacinas' });
    }

    return res.status(201).json({ vaccine });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const getByStation = async (req, res) => {
  try {
    const { stationId } = req.params;

    const station = await StationService.getById(stationId);

    if (!station) {
      return res.status(400).json({ error: 'Posto não encontrado' });
    }

    const vaccines = await VaccineService.getByStation(stationId, req.query);

    if (!vaccines) {
      return res.status(400).json({ error: 'Vacinas não encontradas' });
    }

    return res.status(201).json({ vaccines });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

module.exports = {
  create,
  addVaccines,
  editVaccine,
  getByStation,
};
