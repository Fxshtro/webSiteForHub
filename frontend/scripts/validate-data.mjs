import fs from "node:fs";
import path from "node:path";
import console from "node:console";
import process from "node:process";

const rootDir = process.cwd();
const labsDir = path.join(rootDir, "DataBase", "labs");
const labFiles = [
  "legal-tech.ts",
  "it-lab.ts",
  "inno-travel.ts",
  "finprocess-tech.ts",
  "psy-tech.ts",
];

const errors = [];

function readFile(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), "utf8");
}

function getStringField(block, fieldName) {
  const match = block.match(new RegExp(`${fieldName}:\\s*"([^"]+)"`));
  return match?.[1] ?? "";
}

function getMultilineStringField(block, fieldName) {
  const match = block.match(new RegExp(`${fieldName}:\\s*\\n\\s*"([^"]+)"`));
  return match?.[1] ?? "";
}

function extractArrayBlock(source, propertyName) {
  const startToken = `${propertyName}: [`;
  const startIndex = source.indexOf(startToken);

  if (startIndex === -1) {
    return "";
  }

  let index = startIndex + startToken.length;
  let depth = 1;

  while (index < source.length && depth > 0) {
    const character = source[index];

    if (character === "[") {
      depth += 1;
    } else if (character === "]") {
      depth -= 1;
    }

    index += 1;
  }

  return source.slice(startIndex + startToken.length, index - 1);
}

function extractObjectBlocks(arrayBlock) {
  const blocks = [];
  let startIndex = -1;
  let depth = 0;

  for (let index = 0; index < arrayBlock.length; index += 1) {
    const character = arrayBlock[index];

    if (character === "{") {
      if (depth === 0) {
        startIndex = index;
      }
      depth += 1;
    }

    if (character === "}") {
      depth -= 1;
      if (depth === 0 && startIndex !== -1) {
        blocks.push(arrayBlock.slice(startIndex, index + 1));
        startIndex = -1;
      }
    }
  }

  return blocks;
}

function findDuplicates(values) {
  const seen = new Set();
  const duplicates = new Set();

  for (const value of values) {
    if (!value) continue;
    if (seen.has(value)) {
      duplicates.add(value);
      continue;
    }
    seen.add(value);
  }

  return [...duplicates];
}

const labs = new Map();

for (const fileName of labFiles) {
  const source = fs.readFileSync(path.join(labsDir, fileName), "utf8");
  const slug = getStringField(source, "slug");
  const projects = extractObjectBlocks(extractArrayBlock(source, "projects")).map((block, index) => ({
    index,
    title: getStringField(block, "title"),
    description: getMultilineStringField(block, "description"),
    details: getMultilineStringField(block, "details"),
  }));

  if (!slug) {
    errors.push(`${fileName}: не найден slug`);
    continue;
  }

  if (labs.has(slug)) {
    errors.push(`${fileName}: дублирующийся slug ${slug}`);
  }

  labs.set(slug, { fileName, projects });

  for (const fieldName of ["title", "description", "details"]) {
    const duplicates = findDuplicates(projects.map((project) => project[fieldName]));
    if (duplicates.length > 0) {
      errors.push(`${fileName}: дубли ${fieldName}: ${duplicates.join("; ")}`);
    }
  }

  for (const project of projects) {
    if (!project.title || !project.description || !project.details) {
      errors.push(`${fileName}: проект #${project.index} содержит пустые title/description/details`);
    }
  }
}

const projectsSource = readFile("DataBase/labs/projects.ts");
const registryRecords = [...projectsSource.matchAll(
  /\{\s*id:\s*"([^"]+)",\s*labSlug:\s*"([^"]+)",\s*projectIndex:\s*(\d+),\s*memberIds:\s*\[([^\]]*)\]/g,
)].map((match) => ({
  id: match[1],
  labSlug: match[2],
  projectIndex: Number(match[3]),
  memberIds: [...match[4].matchAll(/"([^"]+)"/g)].map((memberMatch) => memberMatch[1]),
}));

const projectIds = new Set();
const labProjectIndexes = new Set();
const registryCountBySlug = new Map();

for (const record of registryRecords) {
  if (projectIds.has(record.id)) {
    errors.push(`projects.ts: дублирующийся project id ${record.id}`);
  }
  projectIds.add(record.id);

  const projectIndexKey = `${record.labSlug}:${record.projectIndex}`;
  if (labProjectIndexes.has(projectIndexKey)) {
    errors.push(`projects.ts: дублирующийся projectIndex ${projectIndexKey}`);
  }
  labProjectIndexes.add(projectIndexKey);

  const lab = labs.get(record.labSlug);
  if (!lab) {
    errors.push(`projects.ts: неизвестный labSlug ${record.labSlug} у ${record.id}`);
    continue;
  }

  if (record.projectIndex < 0 || record.projectIndex >= lab.projects.length) {
    errors.push(`projects.ts: projectIndex ${record.projectIndex} вне диапазона у ${record.id}`);
  }

  registryCountBySlug.set(record.labSlug, (registryCountBySlug.get(record.labSlug) ?? 0) + 1);
}

for (const [slug, lab] of labs) {
  const registryCount = registryCountBySlug.get(slug) ?? 0;
  if (registryCount !== lab.projects.length) {
    errors.push(`${lab.fileName}: projects.length=${lab.projects.length}, registry=${registryCount}`);
  }
}

const peopleSource = readFile("DataBase/labs/people.ts");
const personIdsByPrefix = new Map();

for (const slug of labs.keys()) {
  const startToken = `  "${slug}": [`;
  const startIndex = peopleSource.indexOf(startToken);
  const block = startIndex === -1 ? "" : extractArrayBlock(peopleSource.slice(startIndex), `"${slug}"`);
  const ids = [...block.matchAll(/id:\s*"([^"]+)"/g)].map((match) => match[1]);
  personIdsByPrefix.set(slug, new Set(ids));
}

for (const record of registryRecords) {
  const personIds = personIdsByPrefix.get(record.labSlug) ?? new Set();

  for (const memberId of record.memberIds) {
    if (!personIds.has(memberId)) {
      errors.push(`projects.ts: ${record.id} содержит неизвестного участника ${memberId}`);
    }
  }
}

if (errors.length > 0) {
  console.error("Data validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Data validation passed: ${labs.size} labs, ${registryRecords.length} projects.`);
