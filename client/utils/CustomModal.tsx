import { Route } from '@/@types/type';
import { Box, Modal } from '@mui/material';
import { FC } from 'react';
interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: any;
  component: FC<any>;
  setRoute?: (route: Route) => void;
}
const CustomModal: React.FC<Props> = ({
  activeItem,
  component: Component,
  open,
  setOpen,
  setRoute,
}) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      arial-labelledby="modal-title"
      arial-describedby="modal-description"
    >
      <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
        <Component
          setOpen={setOpen}
          setRoute={setRoute}
        />
      </Box>
    </Modal>
  );
};
export default CustomModal;
