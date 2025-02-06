import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import { CompletedTransfer } from '../../types/transfers';
import { formatCurrency } from '../../utils/formatters';

interface TransferHistoryProps {
  transfers: CompletedTransfer[];
}

const TransferHistory: React.FC<TransferHistoryProps> = ({ transfers }) => {
  // מיון העברות לפי תאריך (מהחדש לישן)
  const sortedTransfers = [...transfers].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          היסטוריית העברות
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {transfers.length} העברות הושלמו
        </Typography>

        <List>
          {sortedTransfers.map((transfer, index) => (
            <React.Fragment key={transfer.id}>
              {index > 0 && <Divider />}
              <ListItem>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1">
                        {transfer.playerName}
                      </Typography>
                      <Chip
                        label={formatCurrency(transfer.amount)}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary' }}>
                        <Typography variant="body2">
                          מ: {transfer.fromTeam}
                        </Typography>
                        <Typography variant="body2">
                          אל: {transfer.toTeam}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          עמלת סוכן: {transfer.agentFeePercentage}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          השפעה על מוניטין: {transfer.reputationImpact > 0 ? '+' : ''}{transfer.reputationImpact}
                        </Typography>
                      </Box>
                      {transfer.conditions.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            תנאים:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                            {transfer.conditions.map((condition, idx) => (
                              <Chip
                                key={idx}
                                label={condition.description}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        הושלם ב-{new Date(transfer.completedAt).toLocaleDateString('he-IL')}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default TransferHistory; 