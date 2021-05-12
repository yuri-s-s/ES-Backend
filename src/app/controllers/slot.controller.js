/* eslint no-restricted-syntax: "error" */

const CalendarService = require('../services/calendar.service');
const SlotService = require('../services/slot.service');
const UserService = require('../services/user.service');
const StationService = require('../services/station.service');
const util = require('../services/util.service');

const create = async (req, res) => {
  try {
    const { calendarId, stationId } = req.params;

    const {
      initialDate, finalDate, qtdVaccine, priority,
    } = req.body;

    if (!initialDate) {
      return res
        .status(400)
        .json({ error: 'A data inicial do slot é obrigatória' });
    }

    if (!finalDate) {
      return res.status(400).json({ error: 'A data final é obrigatória' });
    }

    if (
      !util.isValidDate(initialDate)
      || !util.isCurrentDate(initialDate, new Date())
    ) {
      return res.status(400).json({ error: 'A data inicial está invalida' });
    }

    if (
      !util.isValidDate(finalDate)
      || !util.isCurrentDate(finalDate, new Date())
    ) {
      return res.status(400).json({ error: 'A data final está invalida' });
    }

    if (!util.isCurrentDate(finalDate, initialDate)) {
      return res
        .status(400)
        .json({ error: 'A data final deve ser maior que a data inicial' });
    }

    if (!qtdVaccine) {
      return res.status(400).json({
        error:
          'A quantidade de vacinas disponibilizadas para o slot é obrigatória',
      });
    }

    const station = await StationService.getById(stationId);

    const validationQuantity = station.qtdVaccine;

    if (qtdVaccine > validationQuantity) {
      return res.status(400).json({ error: 'Vacinas insuficientes' });
    }

    if (!station) {
      return res.status(400).json({ error: 'Posto não encontrado' });
    }

    const calendar = await CalendarService.getById(calendarId);

    if (!calendar) {
      return res.status(400).json({ error: 'O calendário passado não existe' });
    }

    const verifySlotExist = await SlotService.verifySlotExist(
      calendarId,
      initialDate,
    );

    if (verifySlotExist) {
      return res.status(400).json({ error: 'Esse slot de tempo ja existe' });
    }

    const data = {
      calendarId,
      initialDate,
      finalDate,
      qtdVaccine,
      priority,
    };

    const slot = await SlotService.create(data);

    if (!slot) {
      return res
        .status(400)
        .json({ error: 'Não foi possível criar um novo slot' });
    }

    await StationService.removeVaccines({ quantity: qtdVaccine, stationId });

    return res.status(201).json({ slot });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const verifySlot = async (req, res) => {
  try {
    const { calendarId } = req.params;

    const { initialDate } = req.body;

    if (!initialDate) {
      return res
        .status(400)
        .json({ error: 'A data inicial do slot é obrigatória' });
    }

    if (!util.isValidDate(initialDate)) {
      return res.status(400).json({ error: 'A data inicial está invalida' });
    }

    const slot = await SlotService.verifySlotExist(calendarId, initialDate);

    if (!slot) {
      return res.status(400).json({ error: 'Nenhum slot encontrado' });
    }

    return res.status(200).json({ slot });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const associateUserFirstSlot = async (req, res) => {
  try {
    const { calendarId, slotId, userId } = req.params;

    let slot = await SlotService.getSlot(calendarId, slotId);

    if (!slot) {
      return res.status(400).json({ error: 'Nenhum slot encontrado' });
    }

    const quantityAvailable = await SlotService.getVaccineAvailableBySlot(
      slotId,
    );

    if (!quantityAvailable) {
      return res
        .status(400)
        .json({ error: 'Estoque de vacinas esgotadas para esse slot' });
    }

    const user = await UserService.getById(userId);

    if (!user) {
      return res.status(400).json({ error: 'O usuário passado não existe' });
    }

    if (user.firstSlotId) {
      return res
        .status(400)
        .json({ error: 'O usuário já está agendado em um slot' });
    }

    const associate = await UserService.associateUserFirstSlot(slotId, userId);

    if (!associate) {
      return res
        .status(400)
        .json({ error: 'Não possível realizar o agendamento' });
    }

    slot = await SlotService.getSlot(calendarId, slotId);

    return res.status(200).json({ slot });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { userId, slotId } = req.params;
    const user = await UserService.getById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário nao encontrado.' });
    }

    const { firstSlotId } = user;
    const { secondSlotId } = user;

    if (
      parseInt(firstSlotId, 10) !== parseInt(slotId, 10)
      && parseInt(secondSlotId, 10) !== parseInt(slotId, 10)
    ) {
      return res.status(404).json({
        error: 'Cancelamento nao e possivel. Usuario nao possui agendamento.',
      });
    }
    if (parseInt(firstSlotId, 10) === parseInt(slotId, 10)) {
      const newUser = await UserService.removeFirstSlotId(userId);

      return res.status(200).json({ newUser });
    }
    const newUser = await UserService.removeSecondSlotId(userId);

    return res.status(200).json({ newUser });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const associateUserSecondSlot = async (req, res) => {
  try {
    const { calendarId, slotId, userId } = req.params;

    let slot = await SlotService.getSlot(calendarId, slotId);

    if (!slot) {
      return res.status(400).json({ error: 'Nenhum slot encontrado' });
    }

    const quantityAvailable = await SlotService.getVaccineAvailableBySlot(
      slotId,
    );

    if (!quantityAvailable) {
      return res
        .status(400)
        .json({ error: 'Estoque de vacinas esgotadas para esse slot' });
    }

    const user = await UserService.getById(userId);

    if (!user) {
      return res.status(400).json({ error: 'O usuário passado não existe' });
    }

    if (!user.firstSlotId) {
      return res
        .status(400)
        .json({ error: 'O usuário ainda não se agendou para a primeira dose' });
    }

    if (!user.firstVaccine) {
      return res
        .status(400)
        .json({ error: 'O usuário ainda não tomou a primeira dose' });
    }

    if (user.secondVaccine) {
      return res
        .status(400)
        .json({ error: 'O usuário já tomou a segunda dose' });
    }

    if (user.secondSlotId) {
      return res
        .status(400)
        .json({ error: 'O usuário já está agendado em um slot' });
    }

    const associate = await UserService.associateUserSecondSlot(slotId, userId);

    if (!associate) {
      return res
        .status(400)
        .json({ error: 'Não possível realizar o agendamento' });
    }

    slot = await SlotService.getSlot(calendarId, slotId);

    return res.status(200).json({ slot });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const expiredJob = async () => {
  try {
    const slots = await SlotService.getSlotsByDate();

    for await (const slot of slots) {
      const users = await UserService.getBySlot(slot.id);
      const calendar = await CalendarService.getById(slot.calendarId);
      const { stationId } = calendar.dataValues;
      await Promise.all(
        users.rows.map(async (user) => {
          if (user.firstSlotId) {
            if (!user.firstVaccine) {
              await UserService.updateFirstSlotId(user.id);
              await StationService.addVaccines({ stationId, quantity: 1 });
            } else if (user.secondSlotId) {
              if (!user.secondVaccine) {
                await UserService.updateSecondSlotId(user.id);
                await StationService.addVaccines({ stationId, quantity: 1 });
              }
            }
          }
        }),
      );
    }
  } catch (error) {
    console.info(error);
  }
};

const removeSlot = async (req, res) => {
  try {
    const { calendarId, slotId } = req.params;

    let slot = await SlotService.getSlot(calendarId, slotId);

    if (!slot) {
      return res.status(400).json({ error: 'Nenhum slot encontrado' });
    }

    slot = await SlotService.removeSlot(slotId);

    if (!slot) {
      return res.status(400).json({
        error: 'Não é possível remover um slot com agendamentos em andamento',
      });
    }

    return res.status(200).json({ slot });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

const getSlotsByCalendar = async (req, res) => {
  try {
    const { calendarId } = req.params;

    const { initialDate, endDate } = req.query;

    if (initialDate && !endDate) {
      return res
        .status(400)
        .json({ error: 'A data final do slot é obrigatória' });
    }

    if (endDate && !initialDate) {
      return res.status(400).json({ error: 'A data inicial é obrigatória' });
    }

    if (initialDate && !util.isValidDate(initialDate)) {
      return res.status(400).json({ error: 'A data inicial está invalida' });
    }

    if (endDate && !util.isValidDate(endDate)) {
      return res.status(400).json({ error: 'A data final está invalida' });
    }

    const slots = await SlotService.getSlotsByCalendar(calendarId, req.query);

    if (!slots) {
      return res.status(400).json({ error: 'Nenhum slot encontrado' });
    }

    return res.status(200).json({ slots });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

module.exports = {
  create,
  verifySlot,
  associateUserFirstSlot,
  cancelAppointment,
  associateUserSecondSlot,
  expiredJob,
  removeSlot,
  getSlotsByCalendar,
};
