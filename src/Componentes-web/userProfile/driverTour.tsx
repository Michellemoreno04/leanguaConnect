import { driver } from "driver.js";
import "driver.js/dist/driver.css";


const DriverTour = () => {
    const driverObj = driver({
        showProgress: true,
        steps: [
          { popover: { title: 'Bienvenido!', description: 'Editemos tu perfil' } },
          { element: '#editProfile', popover: { title: 'Por aqui', description: 'Apurate' } },
        
        ]
      });

      
      driverObj.drive();
}

export default DriverTour