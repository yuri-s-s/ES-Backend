const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send(`API rodando em ${process.env.BASE_URL || 3000}`);
  });

  module.exports = router;