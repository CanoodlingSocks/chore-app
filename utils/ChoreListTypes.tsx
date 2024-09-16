import { AgendaItem } from "../interfaces/IAgendaItem";

export type ChoreListItemProps = {
    item: AgendaItem;
    onPress: (item: AgendaItem) => void;
  };