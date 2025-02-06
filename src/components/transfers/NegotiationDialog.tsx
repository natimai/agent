import React, { useState, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { TransferOffer, NegotiationMessage } from '../../types/transfers';
import { updateTransferOffer } from '../../store/slices/transfersSlice';
import { formatCurrency } from '../../utils/formatters';

interface NegotiationDialogProps {
  open: boolean;
  onClose: () => void;
  offer: TransferOffer;
}

const NegotiationDialog: React.FC<NegotiationDialogProps> = ({ open, onClose, offer }) => {
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState('');
  const [counterOffer, setCounterOffer] = useState(offer.currentOffer);

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleCounterOfferChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCounterOffer(Number(e.target.value));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: NegotiationMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'AGENT',
      timestamp: new Date().toISOString()
    };

    const updatedOffer = {
      ...offer,
      messages: [...(offer.messages || []), message]
    };

    dispatch(updateTransferOffer(updatedOffer));
    setNewMessage('');
  };

  const handleSubmitCounterOffer = () => {
    const message: NegotiationMessage = {
      id: Date.now().toString(),
      content: `הצעה נגדית: ${formatCurrency(counterOffer)}`,
      sender: 'AGENT',
      timestamp: new Date().toISOString()
    };

    const updatedOffer = {
      ...offer,
      currentOffer: counterOffer,
      messages: [...(offer.messages || []), message],
      status: 'NEGOTIATING' as const
    };

    dispatch(updateTransferOffer(updatedOffer));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          משא ומתן
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* פרטי ההצעה */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">
            הצעה נוכחית
          </Typography>
          <Typography variant="h5">
            {formatCurrency(offer.currentOffer)}
          </Typography>

          {/* תנאים */}
          {offer.conditions.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                תנאים:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                {offer.conditions.map((condition, index) => (
                  <Chip
                    key={index}
                    label={condition.description}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* היסטוריית הודעות */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            היסטוריית שיחה
          </Typography>
          <List>
            {offer.messages?.map((message, index) => (
              <React.Fragment key={message.id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={message.content}
                    secondary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {message.sender === 'AGENT' ? 'אתה' : 'הקבוצה'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(message.timestamp).toLocaleString('he-IL')}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Box>

        {/* הצעה נגדית */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            הצעה נגדית
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              type="number"
              label="סכום"
              value={counterOffer}
              onChange={handleCounterOfferChange}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleSubmitCounterOffer}
              disabled={counterOffer === offer.currentOffer}
            >
              שלח הצעה
            </Button>
          </Box>
        </Box>

        {/* הודעה חדשה */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            הודעה חדשה
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              multiline
              rows={2}
              value={newMessage}
              onChange={handleMessageChange}
              placeholder="כתוב הודעה..."
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              שלח
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>סגור</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NegotiationDialog; 