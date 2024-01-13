import AppPage from "../../modules/ui/AppPage.mjs";
import ToDoList from "./ToDoList.mjs";
import ToDoElement from "./ToDoElement.mjs";

let app = new AppPage($('#app'));
await app.init();

window.app = app;

console.log(app);
