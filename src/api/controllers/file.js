const {
  DocumentAnalysisClient,
  AzureKeyCredential,
} = require("@azure/ai-form-recognizer");
const fs = require("fs");
require("dotenv").config();

const formRecognizerEndpoint = process.env.FORM_RECOGNIZER_ENDPOINT;
const formRecognizerAPIKey = process.env.FORM_RECOGNIZER_API_KEY;
const modelId = process.env.MODEL_ID;

class FileController {
  async upload(req, res) {
    const client = new DocumentAnalysisClient(
      formRecognizerEndpoint,
      new AzureKeyCredential(formRecognizerAPIKey)
    );

    const file = fs.createReadStream(req.file.path);
    const poller = await client.beginAnalyzeDocument(modelId, file);

    const { documents } = await poller.pollUntilDone();

    const fields = documents[0].fields ? documents[0].fields : {};

    const result = {};

    Object.keys(fields).forEach((field) => {
      result[field] = fields[field].value;
    });

    try {
      return res.status(200).json({
        result,
        stuff: "diff",
        status: "success",

        message: "Uploaded file successfully",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message, status: "error" });
    }
  }
}

module.exports = new FileController();
