import { useState } from 'react';
import { styled } from 'styled-components';
import Button from '../components/UI/button/Button';
import IconImageHolder from '../components/UI/general/IconImageHolder';
import OverlayForm from '../components/UI/overlay/OverlayForm';

const LandingWrapper = styled.div`
  transform: translateY(-3%);
`;

const Landing = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <LandingWrapper className="w-full h-full w-max-640 mx-auto flex-center">
        <div className="flex-column i-center gap-3xl w-70 mx-auto">
          <div className="flex-column i-center gap-xs">
            <h1>PLOT</h1>
            <p className="bold">Plan On Timer</p>
          </div>
          <IconImageHolder size="3xxl" isCircle={true}>
            <img className="size-2xxl" src="/png/logo.png" alt="plot logo" />
          </IconImageHolder>
          <div className="w-100 flex-column gap-sm">
            <Button
              onClick={() => {
                setIsOpen(true);
              }}
            >
              시작하기
            </Button>
            <div className="flex i-center">
              <Button className="w-70" styleClass="extra" sizeClass="md">
                이용약관
              </Button>
              {' | '}
              <Button styleClass="extra" sizeClass="md">
                개인정보처리방침
              </Button>
            </div>
          </div>
        </div>
      </LandingWrapper>
      <OverlayForm
        isOpen={isOpen}
        closeHandler={() => {
          setIsOpen(false);
        }}
      >
        안녕
      </OverlayForm>
    </>
  );
};

export default Landing;
