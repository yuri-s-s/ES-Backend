const CalendarService = require('../services/calendar.service');

const getCalendarWithSlots = async (req, res) => {
  try {
    const { calendarId } = req.params;

    const calendar = await CalendarService.getCalendarWithSlots(calendarId);

    if (!calendar) {
      return res.status(400).json({ error: 'Calendário não encontrado' });
    }

    return res.status(200).json({ calendar });
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

module.exports = {
  getCalendarWithSlots,
};
