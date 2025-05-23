const userRepo = require('../repositories/userRepo');

module.exports = {
  async getProfile(userId) {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    return user;
  },

  async updateProfile(userId, updateData) {
    // Дополнительная проверка: если пользователь водитель, должны быть заданы водительские права
    if (updateData.isDriver) {
      if (!updateData.driverLicense || updateData.driverLicense.trim() === '') {
        throw new Error('Водительские права обязательны для водителя');
      }
    }
    
    if (updateData.email) {
      const exists = await userRepo.findByEmail(updateData.email);
      if (exists && exists.id !== userId) {
        throw new Error('Email уже используется');
      }
    }
    
    const updated = await userRepo.updateById(userId, updateData);
    return updated;
  }
};
