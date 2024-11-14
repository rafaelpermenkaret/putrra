__path = process.cwd()
const express = require('express')
const axios = require('axios')
const fetch = require('node-fetch')
const translate = require('translate-google')
const fs = require('fs')
const Jimp = require('jimp')
const FormData = require('form-data')
const baseUrl = 'https://tools.betabotz.org'
const { toanime, tozombie } = require(__path + "/lib/turnimg.js")
const request = require('request')
const { openai } = require(__path + "/lib/openai.js")
const dylux = require('api-dylux')
const textto = require('soundoftext-js')
const googleIt = require('google-it')
const { shortText } = require("limit-text-js")
const TinyURL = require('tinyurl');
const emoji = require("emoji-api");
const isUrl = require("is-url")
const { y2matemp3, y2matemp4 } = require(__path + '/lib/y2mate')
const BitlyClient = require('bitly').BitlyClient
const { fetchJson, getBuffer } = require(__path + '/lib/myfunc')

const isNumber = require('is-number');
const router = express.Router()
const ryzen = require("../lib/listdl")
var error = __path + '/view/error.html'
let creator = 'Rafael'

const {
  convertCRC16,
  generateTransactionId,
  generateExpirationTime,
  elxyzFile,
  generateQRIS,
  createQRIS,
  checkQRISStatus
} = require('./orkut.js')
const { 
Instagram, 
thinkany 
} = require('../lib/scraper.js')

function genreff() {
  const characters = '0123456789';
  const length = 5;
  let reffidgen = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    reffidgen += characters[randomIndex];
  }
  return reffidgen;
}

// Log Info
const messages = {
  error: {
    status: 404,
    creator: "Rafael",
    result: "Error, Service Unavailable",
  },
  notRes: {
    status: 404,
    creator: "Rafael",
    result: "Error, Invalid JSON Result",
  },
  query: {
    status: 400,
    creator: "Rafael",
    result: "Please input parameter query!",
  },
  amount: {
    status: 400,
    creator: "Rafael",
    result: "Please input parameter amount!",
  },
  codeqr: {
    status: 400,
    creator: "Rafael",
    result: "Please input parameter codeqr!",
  },
  url: {
    status: 400,
    creator: "Rafael",
    result: "Please input parameter URL!",
  },
  notUrl: {
    status: 404,
    creator: "Rafael",
    result: "Error, Invalid URL",
  },
};
/**router.get('/testing', (req, res, next) => {
	res.json({
		status: true,
		code: 200,
		creator: creator
	})
})**/


router.get('/downloader/ytmp3', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ message: 'URL tidak valid' });
    
    try {
        let yutub = await y2matemp3(url);
        
        // Struktur hasil yang diinginkan
        const result = {
            title: yutub.title,
            thumbnail: yutub.thumbnail,
            url: yutub.url,
        };
        
        res.json(result);
    } catch (error) {
        res.json({ message: 'Gagal mengunduh, terjadi kesalahan', error: error.message });
    }
});
router.get('/orkut/createpayment', async (req, res) => {
    const { amount } = req.query;
    if (!amount) {
    return res.json("Isi Parameter Amount.");
    }
    const { codeqr } = req.query;
    if (!codeqr) {
    return res.json("Isi Parameter CodeQr menggunakan qris code kalian.");
    }
    try {
        const qrData = await createQRIS(amount, codeqr);
        res.json({ status: true, creator: "Rafael", result: qrData });        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get('/orkut/cekstatus', async (req, res) => {
    const { merchant, keyorkut } = req.query;
        if (!merchant) {
        return res.json({ error: "Isi Parameter Merchant." });
    }
    if (!keyorkut) {
        return res.json({ error: "Isi Parameter Token menggunakan token kalian." });
    }
    try {
        const apiUrl = `https://gateway.okeconnect.com/api/mutasi/qris/${merchant}/${keyorkut}`;
        const response = await axios.get(apiUrl);
        const result = response.data;
                // Check if data exists and get the latest transaction
        const latestTransaction = result.data && result.data.length > 0 ? result.data[0] : null;
                if (latestTransaction) {
            res.json(latestTransaction);
        } else {
            res.json({ message: "No transactions found." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/ai/thinkany", async (req, res) => {
  const { text } = req.query;
  if (!text) return res.status(400).json('mau tanya apa sama ai');

  try {  
    const data = await thinkany(text);
    if (!data) return res.status(404).json(messages.notRes);
    res.json({ status: true, creator: "Rafael", result: data });
  } catch (e) {
    res.status(500).json(messages.error);
  }
});    
router.get("/downloader/igdl", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json(messages.url);

  try {   
    const data = await Instagram(url);
    if (!data) return res.status(404).json(messages.notRes);
    res.json({ status: true, creator: "Rafael", result: data });
  } catch (e) {
    res.status(500).json(messages.error);
  }
});   
router.get("/downloader/tiktok", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json(messages.url);

  try {
  const { tiktokdl } = require("tiktokdl")
    const data = await tiktokdl(url);
    if (!data) return res.status(404).json(messages.notRes);
    res.json({ status: true, creator: "Rafael", result: data });
  } catch (e) {
    res.status(500).json(messages.error);
  }
});     
router.get('/tools/decode', async (req, res) => {
	let text = req.query.text
	if (!text) return res.json(loghandler.nottext)
	if (text.length > 2048) return res.json({ status: false, code: 503, message: "maximum string is 2.048", creator: creator })
	res.json({
		status: true,
		code: 200,
		result: Buffer.from(text, 'base64').toString('ascii')
	})
})
router.get('/tools/encode', async (req, res) => {
	let text = req.query.text
	if (!text) return res.json(loghandler.nottext)
	if (text.length > 2048) return res.json({ message: "maximum text is 2.048" })
	res.json({
		status: true,
		creator: `${creator}`,
		result: Buffer.from(text).toString('base64')
	})
})

module.exports = router
