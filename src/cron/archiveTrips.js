const cron = require('node-cron');
const Trip = require('../models/Trip');

// Каждый час, в начале часа
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    // Получаем дату-время 4 часа назад
    const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);

    const updated = await Trip.query()
      .patch({ status: 'finished' })
      .whereIn('status', ['planned', 'in_progress'])
      .where('departure_time', '<', fourHoursAgo.toISOString());

    if (updated > 0) {
      console.log(`CRON: Архивировано ${updated} поездок (завершённых более 4ч назад)`);
    }
  } catch (err) {
    console.error('CRON: Ошибка при архивировании поездок:', err);
  }
});
