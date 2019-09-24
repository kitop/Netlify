"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const netlify_eventemitter_1 = require("./netlify_eventemitter");
const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100);
const siteId = vscode.workspace.getConfiguration('netlify').get('site_id');
const personalAccessToken = vscode.workspace.getConfiguration('netlify').get('api_token');
const output = vscode.window.createOutputChannel('Netlify');
exports.activate = (context) => __awaiter(void 0, void 0, void 0, function* () {
    const { netlifyEvents } = netlify_eventemitter_1.default;
    netlifyEvents.on('startup', () => {
        output.appendLine(`${siteId}: Fetching deploy status...`);
        statusBar.text = '$(repo-sync~spin)  Netlify Build Status: Fetching deploy status...';
        statusBar.color = vscode.ThemeColor;
        statusBar.show();
    });
    netlifyEvents.on('ready', () => {
        output.appendLine(`${siteId}: Listening for build...`);
        statusBar.text = '$(repo-sync)  Netlify Build Status: Listening for build...';
        statusBar.color = vscode.ThemeColor;
        statusBar.show();
    });
    netlifyEvents.on('deploy-successful', ({ context }) => {
        statusBar.text = `$(check)  Netlify Build Status: Deploy to ${context} was successful!`;
        statusBar.color = '#99ff99';
        statusBar.show();
    });
    netlifyEvents.on('building', ({ branch, context }) => {
        output.appendLine(`${siteId}: ${branch} is deploying to ${context}`);
        statusBar.text = `$(repo-sync~spin)  Netlify Build Status: ${branch} is deploying to ${context}...`;
        statusBar.color = '#99ff99';
        statusBar.show();
    });
    netlifyEvents.on('enqueued', ({ branch, context }) => {
        output.appendLine(`${siteId}: ${branch} is enqueued to deploy to ${context}`);
        statusBar.text = `$(clock)  Netlify Build Status: ${branch} is enqueued to deploy to ${context}...`;
        statusBar.color = ' #99ff99';
        statusBar.show();
    });
    netlifyEvents.on('error', ({ branch, context }) => {
        output.appendLine(`${siteId}: Failed to deploy ${branch} to ${context}`);
        statusBar.text = `$(issue-opened)  Netlify Build Status: ${branch} failed to deploy to ${context}!`;
        statusBar.color = 'orange';
        statusBar.show();
    });
    yield netlify_eventemitter_1.default.start({ siteId, personalAccessToken });
});
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map