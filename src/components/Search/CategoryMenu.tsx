import { useState, Fragment, useEffect } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import LocalStorage from 'utils/LocalStorage';
import type { ParsedUrlQuery } from 'querystring';
import sortBy from 'lodash.sortby';
import filter from 'lodash.filter';
import isString from 'lodash.isstring';
import useCategory from 'hooks/useCategory';
import { CategorySearch } from 'types/product';

interface CategoryMenuProps {
  level?: number;
  name: string;
  id: string;
  defaultOpen?: boolean;
  onChangeCategory: (value: string, idTrack: string[]) => void;
  idTrack: string[];
  query: ParsedUrlQuery;
}

const CategoryMenu = (props: CategoryMenuProps) => {
  const { level = 0, name, id, onChangeCategory, idTrack, query } = props;
  const [open, setOpen] = useState<boolean>(false);
  const { categoryList } = useCategory();
  const categoryTrack = LocalStorage.get('categoryTrack');

  useEffect(() => {
    const track = LocalStorage.get('categoryTrack');
    if (track && track.length > 0 && track.includes(id)) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [query, id]);

  const handleToggleOpen = () => {
    setOpen(!open);
  };

  const handleChangeCategory = () => {
    idTrack.push(id);
    onChangeCategory(id, idTrack);
  };

  return (
    <Fragment>
      {((categoryTrack && categoryTrack.length - 1 <= level) ||
        level === 1) && (
        <ListItemButton
          sx={{
            pl: categoryTrack.length > 1 ? 4 * (level - 1) : 4 * level,
            color:
              isString(query?.category) && query?.category === id
                ? 'vShip.link.main'
                : 'common.black',
          }}
        >
          <ListItemText primary={name} onClick={handleChangeCategory} />
          {categoryList &&
            categoryList[level + 1]?.length > 0 &&
            (open ? (
              <ExpandLess onClick={handleToggleOpen} />
            ) : (
              <ExpandMore onClick={handleToggleOpen} />
            ))}
        </ListItemButton>
      )}
      {categoryList && categoryList[level + 1]?.length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {categoryList &&
              categoryList[level + 1]?.length > 0 &&
              sortBy(
                filter(categoryList[level + 1], (cate: CategorySearch) => {
                  if (level + 1 === 1 && categoryTrack.length >= 2) {
                    return categoryTrack[level + 1] === cate.id;
                  }
                  return cate.parentId === id;
                }),
                [
                  (category) => {
                    return parseInt(category.displayOrder);
                  },
                ]
              )?.map((item) => (
                <CategoryMenu
                  id={item.id}
                  name={item.name}
                  key={item.id}
                  level={level + 1}
                  onChangeCategory={onChangeCategory}
                  idTrack={idTrack.concat([id])}
                  query={query}
                />
              ))}
          </List>
        </Collapse>
      )}
    </Fragment>
  );
};

export default CategoryMenu;
