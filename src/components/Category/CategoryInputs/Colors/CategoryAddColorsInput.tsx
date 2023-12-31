import { Form } from 'react-router-dom';
import CategoryAddGroupColor from './CategoryAddGroupColor';
import { AnimatePresence } from 'framer-motion';
import Backdrop from '../../../UI/overlay/Backdrop';

export interface CategoryAddGroupsColorWrapperProps {
  refProps?: React.RefObject<HTMLFormElement>;
  closeHandler: () => void;
}

const CategoryAddColorsInput = (data: CategoryAddGroupsColorWrapperProps) => {
  const { refProps, closeHandler } = data;
  return (
    <Form method="POST" action="/category" className="hide" ref={refProps}>
      <CategoryAddGroupColor />
      <AnimatePresence>
        <Backdrop onClose={closeHandler} />
      </AnimatePresence>
    </Form>
  );
};

export default CategoryAddColorsInput;
