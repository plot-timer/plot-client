import InputOverlay, { InputOverlayProps } from '../../UI/overlay/InputOverlay';
import CategoryField from './CategoryField';
import CategoryInput from './CategoryInput';
import Backdrop from '../../UI/overlay/Backdrop';
import { useEffect, useState } from 'react';
import CategoryAddGroups from './CategoryAddGroups';
import { AnimatePresence, useAnimate } from 'framer-motion';
import CategoryAddGroupColor from './CategoryAddGroupColor';
import { ActionFunctionArgs, Form, useActionData } from 'react-router-dom';
import { fetchRequest } from '../../../util/request';
import { styled } from 'styled-components';
import { useQuery } from 'react-query';
import { getCategoryGroups } from '../../../util/categoryQueries';

const Wrapper = styled.div`
  @media screen and (min-width: 960px) {
    #backdrop {
      background-color: var(--white);
    }
  }
`;

export interface submitProps {
  (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>): void;
}

interface actionDataProps {
  status?: boolean;
  addColorStatus?: boolean;
}

const CategoryInputOverlay = ({ isOpen, setIsOpen, setHideNav }: InputOverlayProps) => {
  const actionData = useActionData() as actionDataProps;
  const { data: categoryGroups, refetch: getCategoryGroupsQuery } = useQuery(
    ['categoryGroups'],
    getCategoryGroups
  );

  const [onGroups, setOnGroups] = useState(false);
  const [onColors, setOnColors] = useState(false);

  const onAddGroups = () => {
    setHideNav(true);
    setOnGroups(true);
  };

  const closeAddGroups = () => {
    setOnGroups(false);
  };

  const onAddColors: submitProps = (event) => {
    event.preventDefault();
    setOnColors(true);
  };

  const closeAddColors = () => {
    setOnColors(false);
  };

  const closeHandler = () => {
    setIsOpen(false);
    setOnGroups(false);
    setOnColors(false);
  };

  useEffect(() => {
    if (actionData?.addColorStatus) {
      closeAddColors();
      getCategoryGroupsQuery();
    }
    if (actionData?.status) {
      window.location.reload();
    }
  }, [actionData]);

  const [wrapper, setWrapper] = useAnimate();
  const [groups, setGroups] = useAnimate();
  const [colors, setColors] = useAnimate();

  useEffect(() => {
    if (onGroups) {
      setGroups(groups.current, {
        display: 'flex',
        opacity: 1,
      });
      setWrapper(wrapper.current, {
        opacity: 0.8,
      });
      setColors(colors.current, {
        display: 'none',
      });
    }

    if (onGroups && onColors) {
      setGroups(groups.current, {
        opacity: 0.8,
      });
      setColors(colors.current, {
        display: 'flex',
      });
    } else if (!onGroups && !onColors) {
      setGroups(groups.current, {
        display: 'none',
      });
      setColors(colors.current, {
        display: 'none',
      });
      setWrapper(wrapper.current, {
        opacity: 1,
      });
    }
  }, [onGroups, onColors]);

  return (
    <Wrapper>
      <div ref={wrapper}>
        <InputOverlay
          formAction="/category"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setHideNav={setHideNav}
        >
          <CategoryInput isOpen={isOpen} />
          <CategoryField onClick={onAddGroups} />
        </InputOverlay>
      </div>

      <div className="hide" ref={groups}>
        <CategoryAddGroups
          categoryGroups={categoryGroups}
          onClick={onAddColors}
          selectGroup={closeAddGroups}
        />
        <AnimatePresence>
          <Backdrop onClose={closeHandler} />
        </AnimatePresence>
      </div>

      <Form method="POST" action="/category" className="hide" ref={colors}>
        <CategoryAddGroupColor />
        <AnimatePresence>
          <Backdrop onClose={closeHandler} />
        </AnimatePresence>
      </Form>
    </Wrapper>
  );
};

export default CategoryInputOverlay;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent == 'addColor') {
    const submission = {
      groupName: formData.get('groupName'),
      color: formData.get('color'),
    };
    try {
      await fetchRequest({
        url: '/api/category-groups',
        method: 'POST',
        body: submission,
      });

      return { addColorStatus: true };
    } catch {
      return { addColorStatus: false };
    }
  } else {
    try {
      const selectedCategoryId = formData.get('categoryId');
      const submission = {
        categoryName: formData.get('addCategory'),
        emoji: formData.get('emoji'),
        tags: formData.get('tag'),
      };

      await fetchRequest({
        url: `/api/categories/add/${selectedCategoryId}`,
        method: 'POST',
        body: submission,
      });

      return { status: true };
    } catch {
      return { status: false };
    }
  }
};