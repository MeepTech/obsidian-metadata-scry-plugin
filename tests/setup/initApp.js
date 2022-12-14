const mockGetApiFunction = jest.fn();
jest.mock("obsidian-dataview", () => ({
  getAPI: mockGetApiFunction
}));

const mockTFolder = require("../mocks/app-api/folder").default;
const mockTFile = require("../mocks/app-api/file").default;
const { TAbstractFile: mockTAbstractFile } = require("../mocks/app-api/file");

jest.mock("obsidian", () => ({
  TFolder: mockTFolder,
  TFile: mockTFile,
  TAbstractFile: mockTAbstractFile
}));

const JSDOM = require("jsdom").JSDOM;

const dom = new JSDOM()
global.document = dom.window.document
global.window = dom.window

const MetaScryPlugin = require("../mocks/plugins/meta-scry").default;
const App = require("../mocks/app-api/app").default;

app = App.Mock();
MetaScryPlugin.Mock().init(app);