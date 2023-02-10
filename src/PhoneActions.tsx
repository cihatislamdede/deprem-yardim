import { WhatsApp,Call, SMS } from "./Icons";
import { formatPhoneNumberView } from "./utils";

function PhoneActions(props: PhoneActionsProps) {
  return <div className="flex flex-row justify-between mb-2">
    <a href={'tel:+90' + props.number} className="mt-2 text-sm font-bold text-slate-200">
      {formatPhoneNumberView(props.number)}
    </a>
    <div className="flex flex-row justify-right" >
      <a href={'sms:+90' + props.number} className="text-sm font-bold text-slate-200 mt-1">
        <SMS></SMS>
      </a>
      <div className="mx-4 text-sm text-slate-400"></div> 
      <a href={'tel:+90' + props.number} className="text-sm font-bold text-slate-200 mt-1">
        <Call></Call>
      </a>
      <div className="mx-4 text-sm text-slate-400"></div>
      <a href={'https://wa.me/90'+ props.number} className="text-sm font-bold text-slate-200 mt-1">
        <WhatsApp></WhatsApp>
      </a>
    </div>
  </div>
}
interface PhoneActionsProps {
  number: string
}
export default PhoneActions;