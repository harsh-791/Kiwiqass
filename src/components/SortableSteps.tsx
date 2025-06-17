import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { WorkflowStep } from "../types";
import { WorkflowStep as WorkflowStepComponent } from "./WorkflowStep";
import { GripVertical } from "lucide-react";

interface SortableStepProps {
  step: WorkflowStep;
  isFirst: boolean;
  isLast: boolean;
  totalSteps: number;
  onEdit: (stepId: string) => void;
  onDelete: (stepId: string) => void;
  onRevise: (stepId: string) => void;
}

const SortableStep = ({
  step,
  isFirst,
  isLast,
  totalSteps,
  onEdit,
  onDelete,
  onRevise,
}: SortableStepProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    touchAction: "none",
  };

  return (
    <div ref={setNodeRef} style={style} className="touch-none">
      <WorkflowStepComponent
        step={step}
        isFirst={isFirst}
        isLast={isLast}
        totalSteps={totalSteps}
        dragHandleProps={{
          ...attributes,
          ...listeners,
          className: "cursor-grab active:cursor-grabbing touch-none",
        }}
      />
    </div>
  );
};

interface SortableStepsProps {
  steps: WorkflowStep[];
  onReorder: (steps: WorkflowStep[]) => void;
  onEdit: (stepId: string) => void;
  onDelete: (stepId: string) => void;
  onRevise: (stepId: string) => void;
}

const SortableSteps = ({
  steps,
  onReorder,
  onEdit,
  onDelete,
  onRevise,
}: SortableStepsProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex((s) => s.id === active.id);
      const newIndex = steps.findIndex((s) => s.id === over.id);

      const newSteps = arrayMove(steps, oldIndex, newIndex).map(
        (step, index) => ({
          ...step,
          order: index,
        })
      );

      onReorder(newSteps);

      if (window.navigator.vibrate) {
        window.navigator.vibrate(100);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={steps.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        {steps.map((step, index) => (
          <SortableStep
            key={step.id}
            step={step}
            isFirst={index === 0}
            isLast={index === steps.length - 1}
            totalSteps={steps.length}
            onEdit={onEdit}
            onDelete={onDelete}
            onRevise={onRevise}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default SortableSteps;
