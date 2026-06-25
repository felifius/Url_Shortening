

async function geturl(req, res) {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL é obrigatória' });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
}


export { geturl };