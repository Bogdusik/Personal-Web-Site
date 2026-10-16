export type SpecRow = { label: string; value: string; mobile?: boolean };

export type Profile = {
  name: string;
  role: string;
  stackLine: string;
  status: string;
  email: string;
  github: string;
  linkedin: string;
  cvPath: '/cv.pdf';
  cvDownloadName: string;
  location: string;
  rightToWork: string;
  spec: SpecRow[];
};

export type ProjectLinks = {
  repo: string;
  live?: string;
  demo?: string;
  article?: string;
};

export type CiBadge = {
  testsRunInCi: true;
  tests: number;
  note?: string;
  link?: { text: string; href: string };
};

export type Project = {
  id: string;
  code: `P-0${number}`;
  title: string;
  tag: string;
  summary: string;
  stack: string[];
  hardPart?: string;
  ci?: CiBadge;
  links: ProjectLinks;
  placement: 'featured' | 'projects';
};

export type Article = {
  title: string;
  url: string;
  publication: 'HackerNoon';
  published: string;
  topStory?: true;
  projectId?: string;
};

export type Experience = { dates: string; org: string; text: string };
export type Education = { years: string; school: string; award: string; highlight?: string };
export type ToolGroup = { group: string; items: string[] };

export type About = {
  bio: [string, string];
  experience: Experience[];
  education: Education[];
  certificate: string;
  tools: ToolGroup[];
};

export type EdgeDir = 'up' | 'down' | 'left' | 'right';
export type DiagramNodeId = 'client' | 'api' | 'db' | 'claude' | 'jobs';
export type DiagramNode = { id: DiagramNodeId; title: string; lines: string[]; accent?: true };
export type DiagramEdge = {
  id: 'eauth' | 'eorm' | 'ellm' | 'eingest';
  label: string;
  mobile: EdgeDir;
  desktop: EdgeDir;
};
export type Diagram = {
  caption: string;
  description: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
};
