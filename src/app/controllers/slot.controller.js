const CalendarService = require('../services/calendar.service');
const SlotService = require('../services/slot.service');

const create = async (req, res) => {
  try {
    const { calendarId } = req.params;

    const { initialDate, finalDate, qtdVaccine } = req.body;

    if (!initialDate) {
      return res
        .status(400)
        .json({ error: 'A data inicial do slot é obrigatória' });
    }

    if (!finalDate) {
      return res.status(400).json({ error: 'A data final é obrigatória' });
    }

    if (!qtdVaccine) {
      return res
        .status(400)
        .json({
          error:
            'A quantidade de vacinas disponibilizadas para o slot é obrigatória',
        });
    }

    const calendar = await CalendarService.getById(calendarId);

    if (!calendar) {
      return res.status(400).json({ error: 'O calendário passado não existe' });
    }

    const data = {
      calendarId,
      initialDate,
      finalDate,
      qtdVaccine,
    };

    const slot = await SlotService.create(data);

    if (!slot) {
      return res
        .status(400)
        .json({ error: 'Não foi possível criar um novo slot' });
    }

    return res.status(201).json({ slot });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

module.exports = {
  create,
};
