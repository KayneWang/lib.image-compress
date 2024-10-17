#!/usr/bin/env node

import path from 'node:path';
import fs from 'node:fs';
import { program } from 'commander';
import { run } from './compress.js';

const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

program
  .name('image-compress')
  .description('Compress images in a directory.')
  .version(packageJson.version);

program
  .option('-d, --dir <dir>', 'Directory of images to be compressed.')
  .option(
    '-t, --type <type>',
    'Convert to type of image, support jpg, png, webp, default is webp.',
    'webp'
  )
  .option('-q, --quality <quality>', 'Quality of image, default is 80.', 80)
  .parse(process.argv);

const options = program.opts();

run(options.dir, options.type);
