const authService = require('../services/auth.service');

const authenticate = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: 'O email do usuário deve ser passado' });
    }

    if (!password) {
      return res
        .status(400)
        .json({ message: 'A senha do usuário deve ser passado' });
    }

    const auth = await authService.authenticate(req.body);

    return res.status(200).json(auth);
  } catch (error) {
    return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });
  }
};

module.exports = {
  authenticate,
};
