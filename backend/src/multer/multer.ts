import multer from "multer";
const storage = multer.memoryStorage();

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Apenas arquivos JPG e PNG são permitidos.")); // Rejeita o arquivo
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
