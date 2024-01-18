# FW Components (FWC)

### A small frontend framework based on jQuery and component model

Notice: FWC has included some ready to use components based on bootstrap. You should connect bootstrap css and js files
to your project if you want to use them.

### Usage

FWC supports plain js imports and webpack imports. You can just import it in your js file locally or from CDN.

For webpack see Installation section.

```html
<html>
<head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <!-- App holder, can by any html element, body also -->
    <div id="app">
        <!-- Main page component -->
        <fw-component component="page" name="startPage">
            <!-- Bootstrap button component -->
            <fw-component component="bs_button" class="btn btn-primary" name="button" #click="alert('Hello!')">Click me</fw-component>
        </fw-component>
    </div>
    
    <!-- We include jquery in example, but it loads automatically if you use webpack -->
    <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
    
    <!-- Bootstrap js files if needed -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

    <!-- FWC js file -->
    <script type="module">
        import AppPage from "../index.mjs";
        
        // Or if you use webpack
        // import AppPage from "fw-components";

        //Load main page component
        let app = new AppPage($('#app'));
        
        //Init app
        await app.init();
    </script>
</body>
```

### Installation

```bash
npm install fw-components
```

## Demos

For more see [demos folder](/demo/)

## Contribution

Feel free to contribute to this project. You can create issues or pull requests.
