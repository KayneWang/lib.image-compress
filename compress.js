import path from 'node:path';
import fs from 'node:fs';
import sharp from 'sharp';
import ora from 'ora';

const compress = async (file, type, quality) => {
  try {
    const imageBuffer = fs.readFileSync(file);
    switch (type) {
      case 'jpg':
        return await sharp(imageBuffer).jpeg({ quality }).toBuffer();
      case 'png':
        return await sharp(imageBuffer).png({ quality }).toBuffer();
      case 'webp':
        return await sharp(imageBuffer).webp({ quality }).toBuffer();
      default:
        throw new Error('Unsupported image type');
    }
  } catch (error) {
    throw new Error(`Error compressing image: ${error.message}`);
  }
};

export const run = async (dir, type, quality) => {
  if (!dir) {
    console.error('Please provide a directory of images to compress');
    return;
  }

  const outputDir = path.join(dir, 'compressed');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  const files = fs.readdirSync(dir);
  files.forEach(async (file) => {
    if (!file.match(/\.(jpg|jpeg|png)$/)) {
      return;
    }
    const spinner = ora(`Compressing ${file} to ${type}`).start();
    try {
      const image = await compress(path.join(dir, file), type, quality);
      fs.writeFileSync(
        path.join(outputDir, `${path.parse(file).name}.${type}`),
        image
      );
      spinner.succeed(`Compressed ${file} to ${type}`);
    } catch (error) {
      spinner.fail(`Failed to compress ${file}: ${error.message}`);
    }
  });
};
