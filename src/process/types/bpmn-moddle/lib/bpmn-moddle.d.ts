// tslint:disable:interface-name
declare module "bpmn-moddle/lib/bpmn-moddle" {
  import Factory = require("moddle/lib/factory");
  import Moddle = require("moddle/lib/moddle");

  import { Context } from "moddle-xml/lib/reader";
  import { Bpmn } from "modeler/bpmn/bpmn";
  import { Bpmndi } from "modeler/bpmn/bpmndi";
  import { Dc } from "modeler/bpmn/dc";
  import { Processhub } from "modeler/bpmn/processhub";

  type ModdleElement = Factory.ModddleElement;

  type Partial<T> = {
    [P in keyof T]?: T[P];
  };

  /**
   * A sub class of {@link Moddle} with support for import and export of BPMN 2.0 xml files.
   *
   * @class BpmnModdle
   * @extends Moddle
   */
  export default class BpmnModdle extends Moddle {
    /**
     * A sub class of {@link Moddle} with support for import and export of BPMN 2.0 xml files.
     *
     * @class BpmnModdle
     * @extends Moddle
     *
     * @param {Object|Array} packages to use for instantiating the model
     * @param {Object} [options] additional options to pass over
     */
    // should always be created using simple function
    // constructor(packages?: Object[], options?: Object);

    /**
     * Create an instance of the specified type.
     *
     * @method Moddle#create
     *
     * @example
     *
     * var foo = moddle.create('my:Foo');
     * var bar = moddle.create('my:Bar', { id: 'BAR_1' });
     *
     * @param  {String|Object} descriptor the type descriptor or name know to the model
     * @param  {Object} attrs   a number of attributes to initialize the model instance with
     * @return {Object}         model instance
     */
    public create(descriptor: "bpmn:DataOutputAssociation", attrs: Partial<Bpmn.DataOutputAssociation>): Bpmn.DataOutputAssociation;
    public create(descriptor: "bpmn:DataInputAssociation", attrs: Partial<Bpmn.DataInputAssociation>): Bpmn.DataInputAssociation;
    public create(descriptor: "bpmn:DataObjectReference", attrs: Partial<Bpmn.DataObjectReference>): Bpmn.DataObjectReference;
    public create(descriptor: "bpmn:DataStoreReference", attrs: Partial<Bpmn.DataStoreReference>): Bpmn.DataStoreReference;
    public create(descriptor: "bpmn:Collaboration", attrs: Partial<Bpmn.Collaboration>): Bpmn.Collaboration;
    public create(descriptor: "bpmn:BoundaryEvent", attrs: Partial<Bpmn.BoundaryEvent>): Bpmn.BoundaryEvent;
    public create(descriptor: "bpmn:Definitions", attrs: Partial<Bpmn.Definitions>): Bpmn.Definitions;
    public create(descriptor: "bpmn:EndEvent", attrs: Partial<Bpmn.EndEvent>): Bpmn.EndEvent;
    public create(descriptor: "bpmn:ErrorEventDefinition", attrs: Partial<Bpmn.ErrorEventDefinition>): Bpmn.ErrorEventDefinition;
    public create(descriptor: "bpmn:ExclusiveGateway", attrs: Partial<Bpmn.ExclusiveGateway>): Bpmn.ExclusiveGateway;
    public create(descriptor: "bpmn:ExtensionElements", attrs: Partial<Bpmn.ExtensionElements>): Bpmn.ExtensionElements;
    public create(descriptor: "bpmn:FormalExpression", attrs: Partial<Bpmn.FormalExpression>): Bpmn.FormalExpression;
    public create(descriptor: "bpmn:IntermediateCatchEvent", attrs: Partial<Bpmn.IntermediateCatchEvent>): Bpmn.IntermediateCatchEvent;
    public create(descriptor: "bpmn:Lane", attrs: Partial<Bpmn.Lane>): Bpmn.Lane;
    public create(descriptor: "bpmn:LaneSet", attrs: Partial<Bpmn.LaneSet>): Bpmn.LaneSet;
    public create(descriptor: "bpmn:MessageEventDefinition", attrs: Partial<Bpmn.MessageEventDefinition>): Bpmn.MessageEventDefinition;
    public create(descriptor: "bpmn:Participant", attrs: Partial<Bpmn.Participant>): Bpmn.Participant;
    public create(descriptor: "bpmn:ParallelGateway", attrs: Partial<Bpmn.ParallelGateway>): Bpmn.ParallelGateway;
    public create(descriptor: "bpmn:Process", attrs: Partial<Bpmn.Process>): Bpmn.Process;
    public create(descriptor: "bpmn:ScriptTask", attrs: Partial<Bpmn.ScriptTask>): Bpmn.ScriptTask;
    public create(descriptor: "bpmn:SendTask", attrs: Partial<Bpmn.SendTask>): Bpmn.SendTask;
    public create(descriptor: "bpmn:ServiceTask", attrs: Partial<Bpmn.ServiceTask>): Bpmn.ServiceTask;
    public create(descriptor: "bpmn:SequenceFlow", attrs: Partial<Bpmn.SequenceFlow>): Bpmn.SequenceFlow;
    public create(descriptor: "bpmn:StartEvent", attrs: Partial<Bpmn.StartEvent>): Bpmn.StartEvent;
    public create(descriptor: "bpmn:SubProcess", attrs: Partial<Bpmn.SubProcess>): Bpmn.SubProcess;
    public create(descriptor: "bpmn:TimerEventDefinition", attrs: Partial<Bpmn.TimerEventDefinition>): Bpmn.TimerEventDefinition;
    public create(descriptor: "bpmn:UserTask", attrs: Partial<Bpmn.UserTask>): Bpmn.UserTask;
    public create(descriptor: "bpmn:TextAnnotation", attrs: Partial<Bpmn.TextAnnotation>): Bpmn.TextAnnotation;
    public create(descriptor: "bpmn:Association", attrs: Partial<Bpmn.Association>): Bpmn.Association;

    public create(descriptor: "bpmndi:BPMNDiagram", attrs: Partial<Bpmndi.BPMNDiagram>): Bpmndi.BPMNDiagram;
    public create(descriptor: "bpmndi:BPMNEdge", attrs: Partial<Bpmndi.BPMNEdge>): Bpmndi.BPMNEdge;
    public create(descriptor: "bpmndi:BPMNPlane", attrs: Partial<Bpmndi.BPMNPlane>): Bpmndi.BPMNPlane;
    public create(descriptor: "bpmndi:BPMNShape", attrs: Partial<Bpmndi.BPMNShape>): Bpmndi.BPMNShape;
    public create(descriptor: "bpmndi:BPMNLabel", attrs: Partial<Bpmndi.BPMNLabel>): Bpmndi.BPMNLabel;

    public create(descriptor: "dc:Bounds", attrs: Partial<Dc.Bounds>): Dc.Bounds;
    public create(descriptor: "dc:Point", attrs: Partial<Dc.Point>): Dc.Point;
    
    /**
     * Creates an any-element type to be used within model instances.
     *
     * This can be used to create custom elements that lie outside the meta-model.
     * The created element contains all the meta-data required to serialize it
     * as part of meta-model elements.
     *
     * @method Moddle#createAny
     *
     * @example
     *
     * var foo = moddle.createAny('vendor:Foo', 'http://vendor', {
     *   value: 'bar'
     * });
     *
     * var container = moddle.create('my:Container', 'http://my', {
     *   any: [ foo ]
     * });
     *
     * // go ahead and serialize the stuff
     *
     *
     * @param  {String} name  the name of the element
     * @param  {String} nsUri the namespace uri of the element
     * @param  {Object} [properties] a map of properties to initialize the instance with
     * @return {Object} the any type instance
     */
    public createAny(
      name: "processhub:inputOutput",
      nsUri: "http://processhub.com/schema/1.0/bpmn",
      properties: Partial<Processhub.InputOutput>): Processhub.InputOutput;
    public createAny(
      name: "processhub:inputParameter",
      nsUri: "http://processhub.com/schema/1.0/bpmn",
      properties: Partial<Processhub.InputParameter>): Processhub.InputParameter;

    /**
     * Instantiates a BPMN model tree from a given xml string.
     *
     * @param {String}   xmlStr
     * @param {String}   [typeName='bpmn:Definitions'] name of the root element
     * @param {Object}   [options]  options to pass to the underlying reader
     * @param {Function} done       callback that is invoked with (err, result, parseContext)
     *                              once the import completes
     */
    public fromXML(
      xmlStr: string,
      typeName: Bpmn.ElementType,
      options: Object,
      done: (err: Error, result: ModdleElement, parseContext: Context) => void): void;
    public fromXML(xmlStr: string, done: (err: Error, result: Bpmn.Definitions, parseContext: Context) => void): void;

    /**
     * Serializes a BPMN 2.0 object tree to XML.
     *
     * @param {String}   element    the root element, typically an instance of `bpmn:Definitions`
     * @param {Object}   [options]  to pass to the underlying writer
     * @param {Function} done       callback invoked with (err, xmlStr) once the import completes
     */
    public toXML(element: Bpmn.Definitions, options: Object, done: (err: Object, xmlStr: string) => void): void;
  }

  namespace BpmnModdle {
    export interface IElementAttrs {
    }
    export interface IElement extends IElementAttrs {
      readonly $type: Bpmn.ElementType;
      $attrs?: Object;
    }

  }
}