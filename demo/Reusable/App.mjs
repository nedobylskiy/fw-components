import AppPage from "../../modules/ui/AppPage.mjs";

let app = new AppPage($('#app'));

await app.init();

window.app = app;

console.log(app);
