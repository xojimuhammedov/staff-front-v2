import MyModal from 'components/Atoms/MyModal';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { useTranslation } from 'react-i18next';
import { CheckCircle, User, Calendar, Building2, Briefcase, Clock, Download, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from "html2canvas";
import dayjs from 'dayjs';

interface VisitorDetailsModalProps {
  show: boolean;
  onClose: () => void;
  visitor: any;
  organizationData?: any;
  employeeData?: any;
}

const VisitorDetailsModal = ({
  show,
  onClose,
  visitor,
  organizationData,
  employeeData,
}: VisitorDetailsModalProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getOrganizationName = (id: number) => {
    return organizationData?.data?.find((org: any) => org.id === id)?.fullName || '--';
  };

  const getEmployeeName = (id: number) => {
    return employeeData?.data?.find((emp: any) => emp.id === id)?.name || '--';
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("invitation-pdf");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = imgData;
    link.download = `${visitor?.firstName}.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!visitor) return null;

  return (
    <MyModal
      modalProps={{
        show: Boolean(show),
        onClose,
      }}
      headerProps={{
        children: (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-base dark:text-text-title-dark">
                {t('Visitor Created Successfully')}
              </h2>
            </div>
          </div>
        ),
        className: 'px-6 py-4 border-b border-gray-200 dark:border-gray-700',
      }}
      bodyProps={{
        children: (
          <div>
            <div id="invitation-pdf" className="w-full max-w-3xl rounded-2xl p-4 space-y-4">
              {/* Header */}
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-500">
                  This QR code is your entry pass <br />
                  Ushbu QR kod bino kirishi uchun mo‘ljallangan
                </p>
              </div>

              {/* Visitor Info */}
              <div className="bg-gray-50 rounded-[12px] p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <User className="w-4 h-4" />
                    Visitor Information
                  </div>

                  <InfoRow label="Full Name" value={`${visitor.firstName} ${visitor.lastName}`} />
                  <InfoRow label="Phone" value={visitor.phone || '--'} />
                  <InfoRow label="Organization" value={getOrganizationName(visitor.organizationId)} />
                </div>

                {/* QR */}
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="bg-white p-4 rounded-[12px] shadow">
                    {/* QR image o‘rniga */}
                    <div className="w-40 h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                      <QRCodeCanvas
                        value={visitor?.onetimeCode?.code}
                        size={180}
                        includeMargin
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">Scan to check-in</span>
                </div>
              </div>

              {/* Visit Details */}
              <div className="bg-gray-50 rounded-[12px] p-6 space-y-4">
                <h2 className="font-medium text-gray-700 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Visit Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailRow icon={<User />} label="Host" value={getEmployeeName(visitor?.attachId)} />
                  <DetailRow icon={<Calendar />} label="Visit Date" value={dayjs(visitor?.onetimeCode?.startDate).format("YYYY-MM-DD, HH:mm")} />
                  <DetailRow icon={<Building2 />} label="Department" value="IT Department" />
                  <DetailRow icon={<Clock />} label="Time" value="10:00 – 12:00" />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 justify-between items-center p-4 space-y-4">
              <MyButton
                onClick={handleDownloadPDF}
                startIcon={<Download className="w-4 h-4" />}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-black text-white [&_svg]:stroke-bg-white"
              >
                Download PDF
              </MyButton>
              <MyButton onClick={() => navigate("/visitor")} className="px-6 py-2 rounded-lg bg-black text-white hover:opacity-90">
                 Done
              </MyButton>
            </div>
          </div>
        ),
      }}
    />
  );
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase text-gray-400">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-gray-400">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

export default VisitorDetailsModal;
