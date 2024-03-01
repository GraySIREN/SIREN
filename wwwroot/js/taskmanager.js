function setTheme(theme) {
    if (theme === 'theme1') {
        document.documentElement.style.setProperty('--theme-background-color', '#f9ba9c');
        document.documentElement.style.setProperty('--theme-text-color', '#df8155');
        document.documentElement.style.setProperty('--theme-border-color', '#D98B84;')
    } else if (theme === 'theme2') {
        document.documentElement.style.setProperty('--theme-background-color', '#cce2ff');
        document.documentElement.style.setProperty('--theme-text-color', '#3366cc');
        document.documentElement.style.setProperty('--theme-border-color', '#C8D948;')
    }
    else if (theme === 'theme3') {
        document.documentElement.style.setProperty('--theme-background-color', '#1F1F1F');
        document.documentElement.style.setProperty('--theme-text-color', '#BB86FC');
        document.documentElement.style.setProperty('--theme-border-color', '#03DAC6;')
    }
    else if (theme === 'theme4') {
        document.documentElement.style.setProperty('--theme-background-color', '#C2E9F2');
        document.documentElement.style.setProperty('--theme-text-color', '#3C6973');
        document.documentElement.style.setProperty('--theme-border-color', '#7AB3BF;')
    }
    else if (theme === 'theme5') {
        document.documentElement.style.setProperty('--theme-background-color', '#5F5448');
        document.documentElement.style.setProperty('--theme-text-color', '#037E8C');
        document.documentElement.style.setProperty('--theme-border-color', '#F24C27;')
    }
    // Add more else if statements for additional themes
}
