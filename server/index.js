import express from 'express';
import { init, transformAndHash } from  "./util.js";
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
    router.get('/ping', this.vendorPingHandler.bind(this));
    router.get('/local', this.localHandler);
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
        
        if (req.body.test === true) {
          return res.send(processedPayload);
        }
        
        const response = await ping(req, processedPayload)
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
      if (req.body.plain.gender === "Female") {
        res.json({bid: 5, payload: payload})
      } else {
        res.json({bid: 4, payload: payload})
      }
    }


}

const server = new Server();
const PORT = process.env.PORT || 80;
server.start(PORT);
