const StationService = require('../services/station.service');
const CalendarService = require('../services/calendar.service');

const create = async (req, res) => {
  try {
    const {
      name, zipCode, state, city, district, address,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'O nome do posto é obrigatório' });
    }

    if (!zipCode) {
      return res.status(400).json({ error: 'O CEP do posto é obrigatório' });
    }

    if (!state) {
      return res.status(400).json({ error: 'O estado do posto é obrigatório' });
    }

    if (!city) {
      return res.status(400).json({ error: 'A cidade do posto é obrigatório' });
    }

    if (!district) {
      return res.status(400).json({ error: 'O bairro do posto é obrigatório' });
    }

    if (!address) {
      return res.status(400).json({ error: 'A rua do posto é obrigatório' });
    }

    const station = await StationService.create({
      name,
      zipCode,
      state,
      city,
      district,
      address,
    });

    if (!station) {
      return res
        .status(400)
        .json({ error: 'Não foi possível criar um novo posto' });
    }

    await CalendarService.create(station.id);

    return res.status(201).json({ station });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const getById = async (req, res) => {
  try {
    const { stationId } = req.params;

    const station = await StationService.getById(stationId);

    if (!station) {
      return res.status(400).json({ error: 'Não foi encontrado nenhum posto' });
    }

    return res.status(200).json({ station });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const getWithCalendar = async (req, res) => {
  try {
    const { stationId } = req.params;

    const station = await StationService.getWithCalendar(stationId);

    if (!station) {
      return res.status(400).json({ error: 'Não foi encontrado nenhum posto' });
    }

    return res.status(200).json({ station });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const update = async (req, res) => {
  try {
    const { stationId } = req.params;

    const {
      name, zipCode, state, city, district, address,
    } = req.body;

    const station = await StationService.update(stationId, {
      name,
      zipCode,
      state,
      city,
      district,
      address,
    });

    if (!station) {
      return res.status(400).json({ error: 'Não foi possível editar o posto' });
    }

    return res.status(201).json({ station });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const getAll = async (req, res) => {
  try {
    const station = await StationService.getAll(req.query);

    if (!station) {
      return res.status(400).json({ error: 'Não foi encontrado nenhum posto' });
    }

    return res.status(200).json({ station });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const remove = async (req, res) => {
  try {
    const { stationId } = req.params;

    const station = await StationService.remove(stationId);

    if (!station) {
      return res
        .status(400)
        .json({ error: 'Não foi possível remover o posto' });
    }

    return res.status(201).json({ station });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

module.exports = {
  create,
  getById,
  update,
  getAll,
  remove,
  getWithCalendar,
};
