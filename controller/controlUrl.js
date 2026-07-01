import { con } from "../connect.js";

async function geturl(req, res) {
  try {
    let { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL é obrigatória' });
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
  }

    const queryText = `CREATE TABLE IF NOT EXISTS urls(
      id SERIAL PRIMARY KEY, 
      url VARCHAR(255) UNIQUE NOT NULL, 
      shortcode VARCHAR(50) GENERATED ALWAYS AS ('url' || LPAD(id::text, 3, '0')) STORED, 
      created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW(),
      access_count INTEGER DEFAULT 0
    );
    `;
   
    await con.query(queryText);

    const urlExist = await con.query('SELECT * FROM urls WHERE url = $1;', [url]);
    
    if(urlExist.rowCount > 0) return res.status(500).json(`url já cadastrada com código: ${urlExist.rows[0].shortcode}`);


    const populateData = `INSERT INTO urls (url) VALUES ($1) RETURNING shortcode;`;

    await con.query(populateData, [url]);

    return res.status(200).json("Url inserida na Base de dados");


  } catch (error) {
    return res.json(error);
  }
}

async function shortUrl (req, res) {
  try{
    const findurl = await con.query(`SELECT * FROM urls WHERE shortcode = $1`, [req.params.shortCode]);
    if(findurl.rowCount < 1) return res.status(404).json("URL não cadastrada");

    const url = findurl.rows[0].url;
    await con.query(`UPDATE urls SET access_count = access_count + 1 WHERE shortcode = $1`, [req.params.shortCode]);

    return res.redirect(url);

  }
  catch(error){
    res.json(error);

  }
  
}

async function updateUrl(req, res) {
  try {
    const findurl = await con.query(`SELECT * FROM urls WHERE shortcode = $1`, [req.params.shortCode]);
    if(findurl.rowCount < 1) return res.json("URL não cadastrada");

    const url = findurl.rows[0].url;

    const newUrl = req.body.url;

    if (!newUrl) {
      return res.status(400).json({ error: 'Nova URL é obrigatória' });
    }

    
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) 
    {
      newUrl = `https://${newUrl}`;
    }
    await con.query(`UPDATE urls SET url = $1, updated_at = NOW() WHERE shortcode = $2`, [newUrl, req.params.shortCode]);
    return res.status(200).json("URL atualizada");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function deleteUrl(req, res) {
  try {
    const findurl = await con.query(`SELECT * FROM urls WHERE shortcode = $1`, [req.params.shortCode]);
    if(findurl.rowCount < 1) return res.status(404).json("URL não cadastrada");

    await con.query(`DELETE FROM urls WHERE shortcode = $1`, [req.params.shortCode]);
    return res.status(200).json("URL excluída");
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getStats(req, res) {
  try {
    const findurl = await con.query(`SELECT * FROM urls WHERE shortcode = $1`, [req.params.shortCode]);
    if(findurl.rowCount < 1) return res.status(404).json("URL não cadastrada");
    const stats = findurl.rows[0];
    return res.status(200).json(stats);
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
}


export { geturl, shortUrl, updateUrl, deleteUrl, getStats };