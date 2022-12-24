export interface DraggableChangeEvent<T = unknown> {
  added?: {
    /**
     * The index of the added element
     */
    newIndex: number;
    /**
     * The added element
     */
    element: T;
  };
  removed?: {
    /**
     * The index of the element before removal.
     */
    oldIndex: number;
    /**
     * The removed element.
     */
    element: T;
  };
  moved?: {
    /**
     * The current index of the moved element
     */
    newIndex: number;
    /**
     * The old index of the moved element
     */
    oldIndex: number;
    /**
     * The moved element
     */
    element: T;
  };
}
