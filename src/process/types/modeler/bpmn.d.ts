/// <reference path="./bpmndi.d.ts" />
/// <reference path="./dc.d.ts" />

// tslint:disable:no-empty-interface
// tslint:disable:interface-name
declare module "modeler/bpmn/bpmn" {
  import { Bpmndi } from "modeler/bpmn/bpmndi";
  import { Dc } from "modeler/bpmn/dc";

  import Base = require("moddle/lib/base");

  namespace Bpmn {

    export type ElementType = Bpmn.bpmnType | Bpmndi.bpmndiType | Dc.dcType;

    enum AdHocOrdering { }

    enum MultiInstanceBehavior { }

    enum AssociationDirection { }

    enum RelationshipDirection { }

    enum ProcessType { }

    enum GatewayDirection { }

    enum EventBasedGatewayType { }

    enum ItemKind { }

    enum ChoreographyLoopType { }

    export interface BaseElement extends Base {
      $attrs?: {};
      $type: ElementType;

      id: string;
      documentation?: Documentation[];
      extensionDefinitions?: ExtensionDefinition[];
      extensionElements?: ExtensionElements;
    }

    export interface RootElement extends BaseElement {
    }

    export interface Interface extends RootElement {
      readonly $type: "bpmn:Interface";
      name: string;
      operations: Operation[];
      implementationRef: string;
    }

    export interface Operation extends BaseElement {
      readonly $type: "bpmn:Operation";
      name: string;
      inMessageRef: Message;
      outMessageRef: Message;
      errorRef: Error[];
      implementationRef: string;
    }

    export interface EndPoint extends RootElement {
      readonly $type: "bpmn:EndPoint";
    }

    export interface Auditing extends BaseElement {
      readonly $type: "bpmn:Auditing";
    }

    export interface CallableElement extends RootElement {
      name?: string;
      ioSpecification?: InputOutputSpecification;
      supportedInterfaceRef?: Interface[];
      ioBinding?: InputOutputBinding[];
    }

    export interface GlobalTask extends CallableElement {
      readonly $type: "bpmn:GlobalTask"
      | "bpmn:GlobalManualTask"
      | "bpmn:GlobalUserTask"
      | "bpmn:GlobalScriptTask"
      | "bpmn:GlobalBusinessRuleTask";
      resources: ResourceRole[];
    }

    export interface Monitoring extends BaseElement {
      readonly $type: "bpmn:Monitoring";
    }
    
    export interface ResourceRole extends BaseElement {
      resourceRef: Resource;
      resourceParameterBindings: ResourceParameterBinding[];
      resourceAssignmentExpression: ResourceAssignmentExpression;
      name: string;
    }

    export interface Performer extends ResourceRole {
      readonly $type: "bpmn:Performer"
      | "bpmn:HumanPerformer"
      | "bpmn:PotentialOwner";
    }

    export interface FlowElementsContainer extends BaseElement {
      laneSets?: LaneSet[];
      flowElements: FlowElement[];
    }

    export interface Process extends FlowElementsContainer, CallableElement {
      readonly $type: "bpmn:Process";
      processType?: ProcessType;
      isClosed?: boolean;
      auditing?: Auditing;
      monitoring?: Monitoring;
      properties?: Property[];
      laneSets?: LaneSet[];
      flowElements: FlowElement[];
      artifacts?: Artifact[];
      resources?: ResourceRole[];
      correlationSubscriptions?: CorrelationSubscription[];
      supports?: Process[];
      definitionalCollaborationRef?: Collaboration;
      isExecutable?: boolean;
    }

    export interface LaneSet extends BaseElement {
      readonly $type: "bpmn:LaneSet";
      lanes: Lane[];
      name: string;
    }

    export interface Lane extends BaseElement {
      readonly $type: "bpmn:Lane";
      name: string;
      partitionElementRef?: BaseElement;
      partitionElement?: BaseElement;
      flowNodeRef: FlowNode[];
      childLaneSet?: LaneSet;
    }

    export interface GlobalManualTask extends GlobalTask {
      readonly $type: "bpmn:GlobalManualTask";
    }

    export interface FlowElement extends BaseElement {
      name?: string;
      auditing?: Auditing;
      monitoring?: Monitoring;
      categoryValueRef?: CategoryValue[];
    }

    export interface FlowNode extends FlowElement {
      incoming?: SequenceFlow[];
      outgoing?: SequenceFlow[];
    }

    export interface Activity extends FlowNode {
      isForCompensation?: boolean;
      default?: SequenceFlow;
      ioSpecification?: InputOutputSpecification;
      boundaryEventRefs?: BoundaryEvent[];
      properties?: Property[];
      dataInputAssociations?: DataInputAssociation[];
      dataOutputAssociations?: DataOutputAssociation[];
      startQuantity?: number;
      resources?: ResourceRole[];
      completionQuantity?: number;
      loopCharacteristics?: LoopCharacteristics;
    }

    export interface InteractionNode {
    }

    export interface Task extends Activity, InteractionNode {
      readonly $type: "bpmn:Task"
      | "bpmn:ManualTask"
      | "bpmn:UserTask"
      | "bpmn:ServiceTask"
      | "bpmn:SendTask"
      | "bpmn:ReceiveTask"
      | "bpmn:ScriptTask"
      | "bpmn:BusinessRuleTask";
    }

    export interface ManualTask extends Task {
      readonly $type: "bpmn:ManualTask";
    }

    export interface UserTask extends Task {
      readonly $type: "bpmn:UserTask";
      renderings?: Rendering[];
      implementation?: string;
    }

    export interface Rendering extends BaseElement {
      readonly $type: "bpmn:Rendering";
    }

    export interface HumanPerformer extends Performer {
      readonly $type: "bpmn:HumanPerformer"
      | "bpmn:PotentialOwner";
    }

    export interface PotentialOwner extends HumanPerformer {
      readonly $type: "bpmn:PotentialOwner";
    }

    export interface GlobalUserTask extends GlobalTask {
      readonly $type: "bpmn:GlobalUserTask";
      implementation: string;
      renderings: Rendering[];
    }

    export interface Gateway extends FlowNode {
      gatewayDirection?: GatewayDirection;
    }

    export interface EventBasedGateway extends Gateway {
      readonly $type: "bpmn:EventBasedGateway";
      instantiate: boolean;
      eventGatewayType: EventBasedGatewayType;
    }

    export interface ComplexGateway extends Gateway {
      readonly $type: "bpmn:ComplexGateway";
      activationCondition: Expression;
      default: SequenceFlow;
    }

    export interface ExclusiveGateway extends Gateway {
      readonly $type: "bpmn:ExclusiveGateway";
      default?: SequenceFlow;
    }

    export interface InclusiveGateway extends Gateway {
      readonly $type: "bpmn:InclusiveGateway";
      default: SequenceFlow;
    }

    export interface ParallelGateway extends Gateway {
      readonly $type: "bpmn:ParallelGateway";
    }

    export interface Relationship extends BaseElement {
      readonly $type: "bpmn:Relationship";
      type: string;
      direction: RelationshipDirection;
      source: Element[];
      target: Element[];
    }

    export interface Extension {
      readonly $type: "bpmn:Extension";
      mustUnderstand: boolean;
      definition: ExtensionDefinition;
    }

    export interface ExtensionDefinition {
      readonly $type: "bpmn:ExtensionDefinition";
      name: string;
      extensionAttributeDefinitions: ExtensionAttributeDefinition[];
    }

    export interface ExtensionAttributeDefinition {
      readonly $type: "bpmn:ExtensionAttributeDefinition";
      name: string;
      type: string;
      isReference: boolean;
      extensionDefinition: ExtensionDefinition;
    }

    export interface ExtensionElements {
      readonly $type: "bpmn:ExtensionElements";
      valueRef: Element;
      values: Base[];
      extensionAttributeDefinition: ExtensionAttributeDefinition;
    }

    export interface Documentation extends BaseElement {
      readonly $type: "bpmn:Documentation";
      text: string;
      textFormat: string;
    }

    export interface Event extends FlowNode, InteractionNode {
      properties?: Property[];
    }

    export interface CatchEvent extends Event {
      parallelMultiple?: boolean;
      dataOutputs?: DataOutput[];
      dataOutputAssociations?: DataOutputAssociation[];
      outputSet?: OutputSet;
      eventDefinitions?: EventDefinition[];
      eventDefinitionRef?: EventDefinition[];
    }

    export interface IntermediateCatchEvent extends CatchEvent {
      readonly $type: "bpmn:IntermediateCatchEvent";
    }

    export interface ThrowEvent extends Event {
      dataInputs?: DataInput[];
      dataInputAssociations?: DataInputAssociation[];
      inputSet?: InputSet;
      eventDefinitions?: EventDefinition[];
      eventDefinitionRef?: EventDefinition[];
    }

    export interface IntermediateThrowEvent extends ThrowEvent {
      readonly $type: "bpmn:IntermediateThrowEvent";
    }

    export interface EndEvent extends ThrowEvent {
      readonly $type: "bpmn:EndEvent";
    }

    export interface StartEvent extends CatchEvent {
      readonly $type: "bpmn:StartEvent";
      isInterrupting: true;
    }

    export interface BoundaryEvent extends CatchEvent {
      readonly $type: "bpmn:BoundaryEvent";
      cancelActivity: boolean;
      attachedToRef: Activity;
    }

    export interface EventDefinition extends RootElement {
    }

    export interface CancelEventDefinition extends EventDefinition {
      readonly $type: "bpmn:CancelEventDefinition";
    }

    export interface ErrorEventDefinition extends EventDefinition {
      readonly $type: "bpmn:ErrorEventDefinition";
      errorRef: Error;
    }

    export interface TerminateEventDefinition extends EventDefinition {
      readonly $type: "bpmn:TerminateEventDefinition";
    }

    export interface EscalationEventDefinition extends EventDefinition {
      readonly $type: "bpmn:EscalationEventDefinition";
      escalationRef: Escalation;
    }

    export interface Escalation extends RootElement {
      readonly $type: "bpmn:Escalation";
      structureRef: ItemDefinition;
      name: string;
      escalationCode: string;
    }

    export interface CompensateEventDefinition extends EventDefinition {
      readonly $type: "bpmn:CompensateEventDefinition";
      waitForCompletion: boolean;
      activityRef: Activity;
    }

    export interface TimerEventDefinition extends EventDefinition {
      readonly $type: "bpmn:TimerEventDefinition";
      timeDate: Expression;
      timeCycle: Expression;
      timeDuration: Expression;
    }

    export interface LinkEventDefinition extends EventDefinition {
      readonly $type: "bpmn:LinkEventDefinition";
      name: string;
      target: LinkEventDefinition;
      source: LinkEventDefinition[];
    }

    export interface MessageEventDefinition extends EventDefinition {
      readonly $type: "bpmn:MessageEventDefinition";
      messageRef: Message;
      operationRef: Operation;
    }

    export interface ConditionalEventDefinition extends EventDefinition {
      readonly $type: "bpmn:ConditionalEventDefinition";
      condition: Expression;
    }

    export interface SignalEventDefinition extends EventDefinition {
      readonly $type: "bpmn:SignalEventDefinition";
      signalRef: Signal;
    }

    export interface Signal extends RootElement {
      readonly $type: "bpmn:Signal";
      structureRef: ItemDefinition;
      name: string;
    }

    export interface ImplicitThrowEvent extends ThrowEvent {
      readonly $type: "bpmn:ImplicitThrowEvent";
    }

    export interface DataState extends BaseElement {
      readonly $type: "bpmn:DataState";
      name: string;
    }

    export interface ItemAwareElement extends BaseElement {
      readonly $type: "bpmn:ItemAwareElement"
      | "bpmn:DataInput"
      | "bpmn:DataOutput"
      | "bpmn:Property"
      | "bpmn:DataObject"
      | "bpmn:DataStore"
      | "bpmn:DataStoreReference"
      | "bpmn:DataObjectReference";
      itemSubjectRef: ItemDefinition;
      dataState: DataState;
    }

    export interface DataAssociation extends BaseElement {
      readonly $type: "bpmn:DataAssociation"
      | "bpmn:DataInputAssociation"
      | "bpmn:DataOutputAssociation";
      assignment: Assignment[];
      sourceRef: ItemAwareElement[];
      targetRef: ItemAwareElement;
      transformation: FormalExpression;
    }

    export interface DataInput extends ItemAwareElement {
      readonly $type: "bpmn:DataInput";
      name: string;
      isCollection: boolean;
    }

    export interface DataOutput extends ItemAwareElement {
      readonly $type: "bpmn:DataOutput";
      name: string;
      isCollection: boolean;
    }

    export interface InputSet extends BaseElement {
      readonly $type: "bpmn:InputSet";
      name: string;
      dataInputRefs: DataInput[];
      optionalInputRefs: DataInput[];
      whileExecutingInputRefs: DataInput[];
      outputSetRefs: OutputSet[];
    }

    export interface OutputSet extends BaseElement {
      readonly $type: "bpmn:OutputSet";
      dataOutputRefs: DataOutput[];
      name: string;
      inputSetRefs: InputSet[];
      optionalOutputRefs: DataOutput[];
      whileExecutingOutputRefs: DataOutput[];
    }

    export interface Property extends ItemAwareElement {
      readonly $type: "bpmn:Property";
      name: string;
    }

    export interface DataInputAssociation extends DataAssociation {
      readonly $type: "bpmn:DataInputAssociation";
    }

    export interface DataOutputAssociation extends DataAssociation {
      readonly $type: "bpmn:DataOutputAssociation";
    }

    export interface InputOutputSpecification extends BaseElement {
      readonly $type: "bpmn:InputOutputSpecification";
      dataInputs: DataInput[];
      dataOutputs: DataOutput[];
      inputSets: InputSet[];
      outputSets: OutputSet[];
    }

    export interface DataObject extends FlowElement, ItemAwareElement {
      readonly $type: "bpmn:DataObject";
      isCollection: boolean;
    }

    export interface InputOutputBinding {
      readonly $type: "bpmn:InputOutputBinding";
      inputDataRef: InputSet;
      outputDataRef: OutputSet;
      operationRef: Operation;
    }

    export interface Assignment extends BaseElement {
      readonly $type: "bpmn:Assignment";
      from: Expression;
      to: Expression;
    }

    export interface DataStore extends RootElement, ItemAwareElement {
      readonly $type: "bpmn:DataStore";
      name: string;
      capacity: number;
      isUnlimited: boolean;
    }

    export interface DataStoreReference extends ItemAwareElement, FlowElement {
      readonly $type: "bpmn:DataStoreReference";
      dataStoreRef: DataStore;
    }

    export interface DataObjectReference extends ItemAwareElement, FlowElement {
      readonly $type: "bpmn:DataObjectReference";
      dataObjectRef: DataObject;
    }

    export interface ConversationLink extends BaseElement {
      readonly $type: "bpmn:ConversationLink";
      sourceRef: InteractionNode;
      targetRef: InteractionNode;
      name: string;
    }

    export interface ConversationAssociation extends BaseElement {
      readonly $type: "bpmn:ConversationAssociation";
      innerConversationNodeRef: ConversationNode;
      outerConversationNodeRef: ConversationNode;
    }

    export interface ConversationNode extends InteractionNode, BaseElement {
      name: string;
      participantRefs: Participant[];
      messageFlowRefs: MessageFlow[];
      correlationKeys: CorrelationKey[];
    }

    export interface CallConversation extends ConversationNode {
      readonly $type: "bpmn:CallConversation";
      calledCollaborationRef: Collaboration;
      participantAssociations: ParticipantAssociation[];
    }

    export interface Conversation extends ConversationNode {
      readonly $type: "bpmn:Conversation";
    }

    export interface SubConversation extends ConversationNode {
      readonly $type: "bpmn:SubConversation";
      conversationNodes: ConversationNode[];
    }

    export interface Collaboration extends RootElement {
      readonly $type: "bpmn:Collaboration"
      | "bpmn:GlobalConversation"
      | "bpmn:Choreography"
      | "bpmn:GlobalChoreographyTask";
      name?: string;
      isClosed?: boolean;
      participants: Participant[];
      messageFlows?: MessageFlow[];
      artifacts?: Artifact[];
      conversations?: ConversationNode[];
      conversationAssociations?: ConversationAssociation;
      participantAssociations?: ParticipantAssociation[];
      messageFlowAssociations?: MessageFlowAssociation[];
      correlationKeys?: CorrelationKey[];
      choreographyRef?: Choreography[];
      conversationLinks?: ConversationLink[];
    }

    export interface GlobalConversation extends Collaboration {
      readonly $type: "bpmn:GlobalConversation";
    }

    export interface PartnerEntity extends RootElement {
      readonly $type: "bpmn:PartnerEntity";
      name: string;
      participantRef: Participant[];
    }

    export interface PartnerRole extends RootElement {
      readonly $type: "bpmn:PartnerRole";
      name: string;
      participantRef: Participant[];
    }

    export interface CorrelationProperty extends RootElement {
      readonly $type: "bpmn:CorrelationProperty";
      correlationPropertyRetrievalExpression: CorrelationPropertyRetrievalExpression[];
      name: string;
      type: ItemDefinition;
    }

    export interface Error extends RootElement {
      readonly $type: "bpmn:Error";
      structureRef: ItemDefinition;
      name: string;
      errorCode: string;
    }

    export interface CorrelationKey extends BaseElement {
      readonly $type: "bpmn:CorrelationKey";
      correlationPropertyRef: CorrelationProperty[];
      name: string;
    }

    export interface Expression extends BaseElement {
      readonly $type: "bpmn:Expression"
      | "bpmn:FormalExpression";
      body: string;
    }

    export interface FormalExpression extends Expression {
      readonly $type: "bpmn:FormalExpression";
      language: string;
      evaluatesToTypeRef: ItemDefinition;
    }

    export interface Message extends RootElement {
      readonly $type: "bpmn:Message";
      name: string;
      itemRef: ItemDefinition;
    }

    export interface ItemDefinition extends RootElement {
      readonly $type: "bpmn:ItemDefinition";
      itemKind: ItemKind;
      structureRef: string;
      isCollection: boolean;
      import: Import;
    }

    export interface SequenceFlow extends FlowElement {
      readonly $type: "bpmn:SequenceFlow";
      isImmediate: boolean;
      conditionExpression: Expression;
      sourceRef: FlowNode;
      targetRef: FlowNode;
    }

    export interface CorrelationPropertyRetrievalExpression extends BaseElement {
      readonly $type: "bpmn:CorrelationPropertyRetrievalExpression";
      messagePath: FormalExpression;
      messageRef: Message;
    }

    export interface CorrelationPropertyBinding extends BaseElement {
      readonly $type: "bpmn:CorrelationPropertyBinding";
      dataPath: FormalExpression;
      correlationPropertyRef: CorrelationProperty;
    }

    export interface Resource extends RootElement {
      readonly $type: "bpmn:Resource";
      name: string;
      resourceParameters: ResourceParameter[];
    }

    export interface ResourceParameter extends BaseElement {
      readonly $type: "bpmn:ResourceParameter";
      name: string;
      isRequired: boolean;
      type: ItemDefinition;
    }

    export interface CorrelationSubscription extends BaseElement {
      readonly $type: "bpmn:CorrelationSubscription";
      correlationKeyRef: CorrelationKey;
      correlationPropertyBinding: CorrelationPropertyBinding[];
    }

    export interface MessageFlow extends BaseElement {
      readonly $type: "bpmn:MessageFlow";
      name: string;
      sourceRef: InteractionNode;
      targetRef: InteractionNode;
      messageRef: Message;
    }

    export interface MessageFlowAssociation extends BaseElement {
      readonly $type: "bpmn:MessageFlowAssociation";
      innerMessageFlowRef: MessageFlow;
      outerMessageFlowRef: MessageFlow;
    }

    export interface Participant extends InteractionNode, BaseElement {
      readonly $type: "bpmn:Participant";
      name?: string;
      interfaceRef?: Interface[];
      participantMultiplicity?: ParticipantMultiplicity;
      endPointRefs?: EndPoint[];
      processRef?: Process;
    }

    export interface ParticipantAssociation extends BaseElement {
      readonly $type: "bpmn:ParticipantAssociation";
      innerParticipantRef: Participant;
      outerParticipantRef: Participant;
    }

    export interface ParticipantMultiplicity {
      readonly $type: "bpmn:ParticipantMultiplicity";
      minimum: number;
      maximum: number;
    }

    export interface ChoreographyActivity extends FlowNode {
      participantRefs: Participant[];
      initiatingParticipantRef: Participant;
      correlationKeys: CorrelationKey[];
      loopType: ChoreographyLoopType;
    }

    export interface CallChoreography extends ChoreographyActivity {
      readonly $type: "bpmn:CallChoreography";
      calledChoreographyRef: Choreography;
      participantAssociations: ParticipantAssociation[];
    }

    export interface SubChoreography extends ChoreographyActivity, FlowElementsContainer {
      readonly $type: "bpmn:SubChoreography";
      artifacts: Artifact[];
    }

    export interface ChoreographyTask extends ChoreographyActivity {
      readonly $type: "bpmn:ChoreographyTask";
      messageFlowRef: MessageFlow[];
    }

    export interface Choreography extends FlowElementsContainer, Collaboration {
      readonly $type: "bpmn:Choreography"
      | "bpmn:GlobalChoreographyTask";
    }

    export interface GlobalChoreographyTask extends Choreography {
      readonly $type: "bpmn:GlobalChoreographyTask";
      initiatingParticipantRef: Participant;
    }

    export interface Artifact extends BaseElement {
    }

    export interface TextAnnotation extends Artifact {
      readonly $type: "bpmn:TextAnnotation";
      text: string;
      textFormat: string;
    }

    export interface Group extends Artifact {
      readonly $type: "bpmn:Group";
      categoryValueRef: CategoryValue;
    }

    export interface Association extends Artifact {
      readonly $type: "bpmn:Association";
      associationDirection: AssociationDirection;
      sourceRef: BaseElement;
      targetRef: BaseElement;
    }

    export interface Category extends RootElement {
      readonly $type: "bpmn:Category";
      categoryValue: CategoryValue[];
      name: string;
    }

    export interface CategoryValue extends BaseElement {
      readonly $type: "bpmn:CategoryValue";
      value: string;
    }

    export interface ServiceTask extends Task {
      readonly $type: "bpmn:ServiceTask";
      implementation: string;
      operationRef: Operation;
    }

    export interface SubProcess extends Activity, FlowElementsContainer, InteractionNode {
      readonly $type: "bpmn:SubProcess"
      | "bpmn:AdHocSubProcess"
      | "bpmn:Transaction";
      triggeredByEvent: boolean;
      artifacts: Artifact[];
    }

    export interface LoopCharacteristics extends BaseElement {
    }

    export interface MultiInstanceLoopCharacteristics extends LoopCharacteristics {
      readonly $type: "bpmn:MultiInstanceLoopCharacteristics";
      isSequential: boolean;
      behavior: MultiInstanceBehavior;
      loopCardinality: Expression;
      loopDataInputRef: ItemAwareElement;
      loopDataOutputRef: ItemAwareElement;
      inputDataItem: DataInput;
      outputDataItem: DataOutput;
      complexBehaviorDefinition: ComplexBehaviorDefinition[];
      completionCondition: Expression;
      oneBehaviorEventRef: EventDefinition;
      noneBehaviorEventRef: EventDefinition;
    }

    export interface StandardLoopCharacteristics extends LoopCharacteristics {
      readonly $type: "bpmn:StandardLoopCharacteristics";
      testBefore: boolean;
      loopCondition: Expression;
      loopMaximum: Expression;
    }

    export interface CallActivity extends Activity {
      readonly $type: "bpmn:CallActivity";
      calledElement: string;
    }

    export interface SendTask extends Task {
      readonly $type: "bpmn:SendTask";
      implementation: string;
      operationRef: Operation;
      messageRef: Message;
    }

    export interface ReceiveTask extends Task {
      readonly $type: "bpmn:ReceiveTask";
      implementation: string;
      instantiate: boolean;
      operationRef: Operation;
      messageRef: Message;
    }

    export interface ScriptTask extends Task {
      readonly $type: "bpmn:ScriptTask";
      scriptFormat: string;
      script: string;
    }

    export interface BusinessRuleTask extends Task {
      readonly $type: "bpmn:BusinessRuleTask";
      implementation: string;
    }

    export interface AdHocSubProcess extends SubProcess {
      readonly $type: "bpmn:AdHocSubProcess";
      completionCondition: Expression;
      ordering: AdHocOrdering;
      cancelRemainingInstances: boolean;
    }

    export interface Transaction extends SubProcess {
      readonly $type: "bpmn:Transaction";
      protocol: string;
      method: string;
    }

    export interface GlobalScriptTask extends GlobalTask {
      readonly $type: "bpmn:GlobalScriptTask";
      scriptLanguage: string;
      script: string;
    }

    export interface GlobalBusinessRuleTask extends GlobalTask {
      readonly $type: "bpmn:GlobalBusinessRuleTask";
      implementation: string;
    }

    export interface ComplexBehaviorDefinition extends BaseElement {
      readonly $type: "bpmn:ComplexBehaviorDefinition";
      condition: FormalExpression;
      event: ImplicitThrowEvent;
    }

    export interface ResourceParameterBinding {
      readonly $type: "bpmn:ResourceParameterBinding";
      expression: Expression;
      parameterRef: ResourceParameter;
    }

    export interface ResourceAssignmentExpression extends BaseElement {
      readonly $type: "bpmn:ResourceAssignmentExpression";
      expression: Expression;
    }

    export interface Import {
      readonly $type: "bpmn:Import";
      importType: string;
      location: string;
      namespace: string;
    }

    export interface Definitions extends BaseElement {
      readonly $type: "bpmn:Definitions";
      name?: string;
      targetNamespace?: string;
      expressionLanguage: string;
      typeLanguage: string;
      imports?: Import[];
      extensions?: Extension[];
      rootElements: RootElement[];
      diagrams: Bpmndi.BPMNDiagram[];
      exporter?: string;
      relationships?: Relationship[];
      exporterVersion?: string;
      "xmlns:bpmn": "http://www.omg.org/spec/BPMN/20100524/MODEL";
      "xmlns:bpmndi": "http://www.omg.org/spec/BPMN/20100524/DI";
      "xmlns:dc": "http://www.omg.org/spec/DD/20100524/DC";
      "xmlns:di": "http://www.omg.org/spec/DD/20100524/DI";
      "xmlns:processhub": "http://processhub.com/schema/1.0/bpmn";
      "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance";
    }

    export type bpmnType = "bpmn:Interface"
      | "bpmn:Operation"
      | "bpmn:EndPoint"
      | "bpmn:Auditing"
      | "bpmn:GlobalTask"
      | "bpmn:Monitoring"
      | "bpmn:Performer"
      | "bpmn:Process"
      | "bpmn:LaneSet"
      | "bpmn:Lane"
      | "bpmn:GlobalManualTask"
      | "bpmn:ManualTask"
      | "bpmn:UserTask"
      | "bpmn:Rendering"
      | "bpmn:HumanPerformer"
      | "bpmn:PotentialOwner"
      | "bpmn:GlobalUserTask"
      | "bpmn:EventBasedGateway"
      | "bpmn:ComplexGateway"
      | "bpmn:ExclusiveGateway"
      | "bpmn:InclusiveGateway"
      | "bpmn:ParallelGateway"
      | "bpmn:Relationship"
      | "bpmn:Extension"
      | "bpmn:ExtensionDefinition"
      | "bpmn:ExtensionAttributeDefinition"
      | "bpmn:ExtensionElements"
      | "bpmn:Documentation"
      | "bpmn:IntermediateCatchEvent"
      | "bpmn:IntermediateThrowEvent"
      | "bpmn:EndEvent"
      | "bpmn:StartEvent"
      | "bpmn:BoundaryEvent"
      | "bpmn:CancelEventDefinition"
      | "bpmn:ErrorEventDefinition"
      | "bpmn:TerminateEventDefinition"
      | "bpmn:EscalationEventDefinition"
      | "bpmn:Escalation"
      | "bpmn:CompensateEventDefinition"
      | "bpmn:TimerEventDefinition"
      | "bpmn:LinkEventDefinition"
      | "bpmn:MessageEventDefinition"
      | "bpmn:ConditionalEventDefinition"
      | "bpmn:SignalEventDefinition"
      | "bpmn:Signal"
      | "bpmn:ImplicitThrowEvent"
      | "bpmn:DataState"
      | "bpmn:ItemAwareElement"
      | "bpmn:DataAssociation"
      | "bpmn:DataInput"
      | "bpmn:DataOutput"
      | "bpmn:InputSet"
      | "bpmn:OutputSet"
      | "bpmn:Property"
      | "bpmn:DataInputAssociation"
      | "bpmn:DataOutputAssociation"
      | "bpmn:InputOutputSpecification"
      | "bpmn:DataObject"
      | "bpmn:InputOutputBinding"
      | "bpmn:Assignment"
      | "bpmn:DataStore"
      | "bpmn:DataStoreReference"
      | "bpmn:DataObjectReference"
      | "bpmn:ConversationLink"
      | "bpmn:ConversationAssociation"
      | "bpmn:CallConversation"
      | "bpmn:Conversation"
      | "bpmn:SubConversation"
      | "bpmn:GlobalConversation"
      | "bpmn:PartnerEntity"
      | "bpmn:PartnerRole"
      | "bpmn:CorrelationProperty"
      | "bpmn:Error"
      | "bpmn:CorrelationKey"
      | "bpmn:Expression"
      | "bpmn:FormalExpression"
      | "bpmn:Message"
      | "bpmn:ItemDefinition"
      | "bpmn:SequenceFlow"
      | "bpmn:CorrelationPropertyRetrievalExpression"
      | "bpmn:CorrelationPropertyBinding"
      | "bpmn:Resource"
      | "bpmn:ResourceParameter"
      | "bpmn:CorrelationSubscription"
      | "bpmn:MessageFlow"
      | "bpmn:MessageFlowAssociation"
      | "bpmn:Participant"
      | "bpmn:ParticipantAssociation"
      | "bpmn:ParticipantMultiplicity"
      | "bpmn:Collaboration"
      | "bpmn:CallChoreography"
      | "bpmn:SubChoreography"
      | "bpmn:ChoreographyTask"
      | "bpmn:Choreography"
      | "bpmn:GlobalChoreographyTask"
      | "bpmn:TextAnnotation"
      | "bpmn:Group"
      | "bpmn:Association"
      | "bpmn:Category"
      | "bpmn:CategoryValue"
      | "bpmn:ServiceTask"
      | "bpmn:SubProcess"
      | "bpmn:MultiInstanceLoopCharacteristics"
      | "bpmn:StandardLoopCharacteristics"
      | "bpmn:CallActivity"
      | "bpmn:Task"
      | "bpmn:SendTask"
      | "bpmn:ReceiveTask"
      | "bpmn:ScriptTask"
      | "bpmn:BusinessRuleTask"
      | "bpmn:AdHocSubProcess"
      | "bpmn:Transaction"
      | "bpmn:GlobalScriptTask"
      | "bpmn:GlobalBusinessRuleTask"
      | "bpmn:ComplexBehaviorDefinition"
      | "bpmn:ResourceRole"
      | "bpmn:ResourceParameterBinding"
      | "bpmn:ResourceAssignmentExpression"
      | "bpmn:Import"
      | "bpmn:Definitions";
  }
}
