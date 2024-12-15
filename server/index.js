import express from 'express';
import { init, transformAndHash, ping } from  "./util.js";
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Server {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.registerRoutes();
  }
    
  start(port){
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }

  registerRoutes() {
    const router = express.Router();

    router.get("/", this.homeHandler);
    router.post("/ping", this.vendorPingHandler.bind(this));
    router.get('/local', this.localHandler.bind(this));
    router.post("/localBuyer", this.localBuyerHandler.bind(this));
    router.get("/register", this.registerHandler);

    this.app.use(router);

  }
  
    homeHandler(req, res) {
      const filePath = '/home/miles/hopp/public/index.html'
      res.sendFile(filePath);
    }

    registerHandler(req, res) {
      const filePath = '/home/miles/hopp/public/register.html'
      res.sendFile(filePath);
    }

    async vendorPingHandler(req, res) {
      try{
        init(req.body)

        const processedPayload= transformAndHash(req.body)
        const response = await ping(req, processedPayload)
        
        if (req.body.test === true) {
          const responseAndTest = {...response, processedPayload};
          return res.send(responseAndTest);
        }

        res.send(response)
      } catch (error) {
        console.error("Error sending request", error);
      }
    }

    localHandler(req, res) {
      const filePath = path.join(__dirname, '..', 'public', 'index_local.html');
      res.sendFile(filePath);
    }

    localBuyerHandler(req, res) {
      const payload = transformAndHash(req.body)
      if (req.body.gender === "Female") {
        res.json({bid: 5, transactionID: Math.floor(Math.random() * (99999- 10000) + 10000)})
      } else {
        res.json({bid: 4, transactionID: Math.floor(Math.random() * (99999- 10000) + 10000)})
      }
    }


}

const server = new Server();
const PORT = process.env.PORT || 80;
server.start(PORT);
