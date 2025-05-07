import{ Item } from '../../Ui/Item/Item.jsx';

export const MainNav = ({styleContainer}) => {
    return (
      <div className={styleContainer}>
            <Item styleLi='item' contenido="Inicio " />
            <Item styleLi='item' contenido="Cascos " />
            <Item styleLi='item-extend' contenido="Equipacion carretera " />
            <Item styleLi='item' contenido="Accesorios " />
            <Item styleLi='item' contenido="Marcas " />
            <Item styleLi='item' contenido="Calcomanias " />
            <Item styleLi='item' contenido="Luces " />
            <Item styleLi='item' contenido="Limpieza " />
      </div>
    );
  };
  