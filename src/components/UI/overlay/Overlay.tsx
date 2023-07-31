import { AnimatePresence, motion } from 'framer-motion';
import { PropsWithChildren, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { styled } from 'styled-components';

export interface OverlayProps {
  id: string;
  hash?: string;
  isOpen: boolean;
  onClose: () => void;
  isFlat?: boolean;
  className?: string;
}

interface OverlayWrapperProps {
  $isFlat?: boolean;
}

const BackDrop = styled(motion.div)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--black);
`;

const OverlayWrapper = styled(motion.div)<OverlayWrapperProps>`
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 640px;
  box-sizing: border-box;
  padding: 2rem;
  border-radius: ${({ $isFlat }) => ($isFlat ? '0 0' : 'var(--round-xl) var(--round-xl)')}
    0 0;
  background-color: var(--white);

  @media screen and (min-height: 1024px) {
    padding-bottom: 30vh;
  }

  @media screen and (max-height: 1024px) and (min-height: 960px) {
    padding-bottom: 20vh;
  }
`;

const Overlay = ({
  id,
  hash,
  isOpen,
  onClose,
  isFlat,
  className,
  children,
}: PropsWithChildren<OverlayProps>) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      navigate(
        `${location.pathname}${location.search}${location.hash}${hash || ''}#${id}`
      );
    } else if (location.hash.includes(id)) {
      navigate(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !location.hash.includes(id)) {
      onClose();
    }
  }, [location]);

  return (
    <div className="vw-100 vh-100 w-max-640 mx-auto">
      <AnimatePresence>
        {/* backdrop */}
        {isOpen && (
          <>
            <BackDrop
              onClick={() => {
                onClose();
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
            />
            <OverlayWrapper
              className={className || ''}
              $isFlat={isFlat}
              initial={{ transform: 'translateY(100%)' }}
              animate={{ transform: 'translateY(0)' }}
              exit={{ transform: 'translateY(100%)' }}
            >
              {children}
            </OverlayWrapper>
          </>
        )}
      </AnimatePresence>
      {/* overlay */}
    </div>
  );
};

export default Overlay;
