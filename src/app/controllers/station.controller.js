const StationService = require('../services/station.service');
const CalendarService = require('../services/calendar.service');
const UserService = require('../services/user.service');
const VaccineService = require('../services/vaccine.service');

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

const insertFirstVaccine = async (req, res) => {
  try {
    const { stationId, vaccineId, userId } = req.params;

    const station = await StationService.getById(stationId);

    if (!station) {
      return res.status(400).json({ error: 'Posto não encontrado' });
    }

    const vaccine = await VaccineService.getById(vaccineId);

    if (!vaccine) {
      return res.status(400).json({ error: 'Vacina não encontrada' });
    }

    if (vaccine.quantity <= 0) {
      return res.status(400).json({ error: 'Vacinas acabaram' });
    }

    const user = await UserService.getById(userId);

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    if (user.firstVaccine) {
      return res
        .status(400)
        .json({ error: 'Esse usuário ja tomou a primeira dose' });
    }

    await VaccineService.decrementVaccines(vaccineId);

    const newUser = await UserService.insertFirstVaccine(userId, vaccine.name);

    return res.status(201).json({ newUser });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const insertSecondVaccine = async (req, res) => {
  try {
    const { stationId, vaccineId, userId } = req.params;

    const station = await StationService.getById(stationId);

    if (!station) {
      return res.status(400).json({ error: 'Posto não encontrado' });
    }

    const vaccine = await VaccineService.getById(vaccineId);

    if (!vaccine) {
      return res.status(400).json({ error: 'Vacina não encontrada' });
    }

    if (vaccine.quantity <= 0) {
      return res.status(400).json({ error: 'Vacinas acabaram' });
    }

    const user = await UserService.getById(userId);

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    if (user.secondVaccine) {
      return res
        .status(400)
        .json({ error: 'Esse usuário ja tomou a segunda dose' });
    }

    if (!user.firstVaccine) {
      return res
        .status(400)
        .json({ error: 'Esse usuário ainda não tomou a primeira dose' });
    }

    await VaccineService.decrementVaccines(vaccineId);

    const newUser = await UserService.insertSecondVaccine(userId, vaccine.name);

    return res.status(201).json({ newUser });
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
  insertFirstVaccine,
  insertSecondVaccine,
};
