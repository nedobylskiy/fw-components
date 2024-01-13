import AppPage from "../modules/ui/AppPage.mjs";
import CustomComponent from "./CustomComponent.mjs";

let app = new AppPage($('#app'));

await CustomComponent.register();

await app.init();

window.app = app;

console.log(app);
